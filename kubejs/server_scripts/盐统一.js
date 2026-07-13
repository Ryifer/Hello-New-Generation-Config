// 统一盐 —— 把烘焙坊盐统一成森罗国味盐, 保留全部获取配方
//
// 调查结论:
// - 国味盐 ID: kaleidoscope_chinesefood:salt
// - 没有配方直接吃 bakeries:salt 物品, 消耗盐全部走 c:salt 标签
// - c:salt 标签当前只含 bakeries:salt, 不含国味盐
// - 产出 bakeries:salt 的配方只有 3 个: 两个冶炼 + 一个面粉筛

const CN_SALT = 'kaleidoscope_chinesefood:salt'

// 1) 把国味盐加进 c:salt 标签 -> 所有走标签的消耗配方自动接受国味盐
//    (保留 bakeries:salt 在标签内, 让玩家手里的旧盐仍可用)
ServerEvents.tags('item', event => {
    event.add('c:salt', CN_SALT)
})

// 2) 把产出 bakeries:salt 的配方改为产出国味盐
ServerEvents.recipes(event => {

    // 两个冶炼配方 (盐矿石 / 深板岩盐矿石) -> 标准类型, replaceOutput 可处理
    event.replaceOutput({ type: 'minecraft:smelting' }, 'bakeries:salt', CN_SALT)

    // 面粉筛 (bakeries:flour_sieve 自定义类型, 需 remove + 重建)
    event.remove({ type: 'bakeries:flour_sieve', output: 'bakeries:salt' })
    event.custom({
        type: 'bakeries:flour_sieve',
        ingredient: { item: 'bakeries:raw_salt_block' },
        output: { count: 9, id: CN_SALT }
    })
})
