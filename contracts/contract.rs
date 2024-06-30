use cosmwasm_std::{
    attr, BankMsg, Coin, CosmosMsg, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint128, Addr, Deps, to_binary, WasmMsg,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::entry_point;
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub owner: Addr,
    pub community_pool: Addr,
    pub fair_burn: Addr,
    pub royalty_cap: u8,
    pub platform_fee: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Listing {
    pub seller: Addr,
    pub price: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Collection {
    pub creator: Addr,
    pub mint_cost: Uint128,
    pub max_supply: u32,
    pub minted: u32,
}

pub const STATE: Item<State> = Item::new("state");
pub const LISTINGS: Map<&str, Listing> = Map::new("listings");
pub const COLLECTIONS: Map<&str, Collection> = Map::new("collections");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    community_pool: String,
    fair_burn: String,
    platform_fee: String,
    royalty_cap: u8,
) -> StdResult<Response> {
    let state = State {
        owner: info.sender.clone(),
        community_pool: deps.api.addr_validate(&community_pool)?,
        fair_burn: deps.api.addr_validate(&fair_burn)?,
        platform_fee: deps.api.addr_validate(&platform_fee)?,
        royalty_cap,
    };
    STATE.save(deps.storage, &state)?;
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Mint { collection_id, recipient } => mint(deps, env, info, collection_id, recipient),
        ExecuteMsg::SetRoyalty { new_royalty } => set_royalty(deps, env, info, new_royalty),
        ExecuteMsg::List { nft_id, price } => list_nft(deps, env, info, nft_id, price),
        ExecuteMsg::Buy { nft_id } => buy_nft(deps, env, info, nft_id),
        ExecuteMsg::ReleaseCollection { collection_id, mint_cost, max_supply, curated } => release_collection(deps, env, info, collection_id, mint_cost, max_supply, curated),
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    Mint { collection_id: String, recipient: String },
    SetRoyalty { new_royalty: u8 },
    List { nft_id: String, price: Uint128 },
    Buy { nft_id: String },
    ReleaseCollection { collection_id: String, mint_cost: Uint128, max_supply: u32, curated: bool },
}

pub fn mint(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    collection_id: String,
    recipient: String,
) -> StdResult<Response> {
    let state = STATE.load(deps.storage)?;
    let mut collection = COLLECTIONS.load(deps.storage, &collection_id)?;

    if collection.minted >= collection.max_supply {
        return Err(StdError::generic_err("Collection minting limit reached"));
    }

    let mint_cost = collection.mint_cost;
    
    let platform_fee = mint_cost.multiply_ratio(50u128, 100u128); // 50% platform fee
    let community_pool_fee = platform_fee.multiply_ratio(1u128, 2u128); // Half of platform fee to community pool
    let burn_fee = platform_fee.checked_sub(community_pool_fee)?; // Other half to burn address

    // Messages to transfer fees
    let platform_fee_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.platform_fee.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: platform_fee,
        }],
    });
    
    let community_pool_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.community_pool.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: community_pool_fee,
        }],
    });
    
    let burn_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.fair_burn.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: burn_fee,
        }],
    });
    
    // Remaining amount to recipient
    let recipient_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: recipient.clone(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: mint_cost.checked_sub(platform_fee)?,
        }],
    });

    // Update minted count
    collection.minted += 1;
    COLLECTIONS.save(deps.storage, &collection_id, &collection)?;
    
    Ok(Response::new()
        .add_message(platform_fee_msg)
        .add_message(community_pool_msg)
        .add_message(burn_msg)
        .add_message(recipient_msg)
        .add_attributes(vec![
            attr("method", "mint"),
            attr("collection_id", collection_id),
            attr("recipient", recipient),
            attr("mint_cost", mint_cost.to_string()),
            attr("platform_fee", platform_fee.to_string()),
        ]))
}

pub fn set_royalty(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    new_royalty: u8,
) -> StdResult<Response> {
    let mut state = STATE.load(deps.storage)?;
    
    if info.sender != state.owner {
        return Err(StdError::unauthorized());
    }

    if new_royalty > state.royalty_cap {
        return Err(StdError::generic_err("Royalty fee exceeds cap"));
    }

    state.royalty_cap = new_royalty;
    STATE.save(deps.storage, &state)?;
    
    Ok(Response::new().add_attribute("method", "set_royalty"))
}

pub fn list_nft(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    nft_id: String,
    price: Uint128,
) -> StdResult<Response> {
    if LISTINGS.has(deps.storage, &nft_id) {
        return Err(StdError::generic_err("NFT is already listed for sale"));
    }

    let listing = Listing {
        seller: info.sender.clone(),
        price,
    };

    LISTINGS.save(deps.storage, &nft_id, &listing)?;

    Ok(Response::new()
        .add_attribute("method", "list_nft")
        .add_attribute("nft_id", nft_id)
        .add_attribute("price", price.to_string()))
}

pub fn buy_nft(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    nft_id: String,
) -> StdResult<Response> {
    let listing = LISTINGS.load(deps.storage, &nft_id)?;
    let state = STATE.load(deps.storage)?;

    let sale_price = listing.price;
    
    // Validate that enough funds are sent
    let sent_funds = info.funds.iter().find(|c| c.denom == "ujuno").map(|c| c.amount).unwrap_or(Uint128::zero());
    if sent_funds < sale_price {
        return Err(StdError::generic_err("Insufficient funds sent"));
    }

    let platform_fee = sale_price.multiply_ratio(50u128, 100u128); // 50% platform fee
    let community_pool_fee = platform_fee.multiply_ratio(1u128, 2u128); // Half of platform fee to community pool
    let burn_fee = platform_fee.checked_sub(community_pool_fee)?; // Other half to burn address

    // Royalty calculation (assuming 10% for example)
    let royalty_fee = sale_price.multiply_ratio(state.royalty_cap as u128, 100u128); // Royalty fee

    // Messages to transfer fees
    let platform_fee_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.platform_fee.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: platform_fee,
        }],
    });

    let community_pool_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.community_pool.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: community_pool_fee,
        }],
    });
    
    let burn_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.fair_burn.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: burn_fee,
        }],
    });

    // Transfer remaining amount to seller after deducting platform and royalty fees
    let seller_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: listing.seller.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: sale_price.checked_sub(platform_fee)?.checked_sub(royalty_fee)?,
        }],
    });

    // Remove the listing
    LISTINGS.remove(deps.storage, &nft_id);

    Ok(Response::new()
        .add_message(platform_fee_msg)
        .add_message(community_pool_msg)
        .add_message(burn_msg)
        .add_message(seller_msg)
        .add_attributes(vec![
            attr("method", "buy_nft"),
            attr("nft_id", nft_id),
            attr("sale_price", sale_price.to_string()),
            attr("platform_fee", platform_fee.to_string()),
            attr("royalty_fee", royalty_fee.to_string()),
        ]))
}

pub fn release_collection(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    collection_id: String,
    mint_cost: Uint128,
    max_supply: u32,
    curated: bool,
) -> StdResult<Response> {
    let state = STATE.load(deps.storage)?;

    // Curated and standard fee amounts
    let collection_fee = if curated { Uint128::from(10u128) } else { Uint128::from(100u128) };

    // Validate that enough funds are sent for collection creation
    let sent_funds = info.funds.iter().find(|c| c.denom == "ujuno").map(|c| c.amount).unwrap_or(Uint128::zero());
    if sent_funds < collection_fee {
        return Err(StdError::generic_err("Insufficient funds sent for collection creation"));
    }

    if COLLECTIONS.has(deps.storage, &collection_id) {
        return Err(StdError::generic_err("Collection ID already exists"));
    }

    let collection = Collection {
        creator: info.sender.clone(),
        mint_cost,
        max_supply,
        minted: 0,
    };

    COLLECTIONS.save(deps.storage, &collection_id, &collection)?;

    let platform_fee = collection_fee.multiply_ratio(50u128, 100u128); // 50% platform fee
    let community_pool_fee = platform_fee.multiply_ratio(1u128, 2u128); // Half of platform fee to community pool
    let burn_fee = platform_fee.checked_sub(community_pool_fee)?; // Other half to burn address

    // Messages to transfer fees
    let platform_fee_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.platform_fee.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: platform_fee,
        }],
    });

    let community_pool_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.community_pool.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: community_pool_fee,
        }],
    });
    
    let burn_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: state.fair_burn.to_string(),
        amount: vec![Coin {
            denom: "ujuno".to_string(),
            amount: burn_fee,
        }],
    });

    Ok(Response::new()
        .add_message(platform_fee_msg)
        .add_message(community_pool_msg)
        .add_message(burn_msg)
        .add_attributes(vec![
            attr("method", "release_collection"),
            attr("collection_id", collection_id),
            attr("mint_cost", mint_cost.to_string()),
            attr("max_supply", max_supply.to_string()),
            attr("curated", curated.to_string()),
            attr("collection_fee", collection_fee.to_string()),
        ]))
}
