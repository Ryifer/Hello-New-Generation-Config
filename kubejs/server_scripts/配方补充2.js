ServerEvents.recipes(event => {
    // 切石机配方（已废弃）
    //event.stonecutting('cbc_firepower_components:compact_cannon_mount','cbc_compact_mount:compact_cannon_mount')
    //event.stonecutting('cbc_firepower_components:compact_autocannon_mount','cbc_compact_mount:compact_cannon_mount')
    //event.stonecutting('cbc_firepower_components:autocannon_ammo_feed','cbc_compact_mount:compact_cannon_mount')
    //event.stonecutting('cbc_firepower_components:cannon_magazine_loader','cbc_compact_mount:compact_cannon_mount')

    // 顶替原有配方：先移除所有产出 rice_bread_dough 的配方
    event.remove({ output: 'bakeries:rice_bread_dough' })

    // 再添加使用森罗物语稻米的新配方
    event.shapeless('bakeries:rice_bread_dough', [
        'bakeries:round_bread_dough',
        'kaleidoscope_cookery:rice'
    ])
})