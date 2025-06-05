module user_coin::{{tokenLower}} {
    use eggx_test::token_utils::create_token;
    use sui::url;

    public struct {{tokenUpper}} has drop {}

    fun init(witness: {{tokenUpper}}, ctx: &mut tx_context::TxContext) {
        let icon_url = option::some(
            url::new_unsafe_from_bytes(b"{{image_url}}")
        );

        let treasury_cap = create_token<{{tokenUpper}}>(
            witness,
            9,
            b"{{tokenUpper}}",
            b"{{name}}",
            b"{{description}}",
            icon_url,
            ctx,
        );

        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }
}
 