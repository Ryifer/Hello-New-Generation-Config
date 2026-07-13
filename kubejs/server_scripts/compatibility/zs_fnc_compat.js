// ============================================================================
// zs_fnc_compat.js — BOP × Create × Farm & Charm 兼容
// ----------------------------------------------------------------------------
// 原作者: Ryifer 许可证: CC BY-NC 4.0
// 此文件为本地补充，不修改任何原 kubejs 脚本，方便保持对上游的跟进。
// ============================================================================

ServerEvents.recipes(function (event) {

    var create = event.recipes.create;

    // ========================================================================
    // 六、F&C 缠魂野化（栽培 → 野生）
    // ========================================================================

    // 6.1 F&C 作物野化
    var WILDING = [
        ['farm_and_charm:barley',      'farm_and_charm:wild_barley'],
        ['farm_and_charm:oat',         'farm_and_charm:wild_oat'],
        ['farm_and_charm:corn',        'farm_and_charm:wild_corn'],
        ['farm_and_charm:lettuce',     'farm_and_charm:wild_lettuce'],
        ['farm_and_charm:onion',       'farm_and_charm:wild_onions'],
        ['farm_and_charm:tomato',      'farm_and_charm:wild_tomatoes'],
        ['farm_and_charm:strawberry',  'farm_and_charm:wild_strawberries'],
        ['minecraft:beetroot',         'farm_and_charm:wild_beetroots'],
        ['minecraft:carrot',           'farm_and_charm:wild_carrots'],
        ['minecraft:potato',           'farm_and_charm:wild_potatoes']
    ];
    WILDING.forEach(function(pair) {
        create.haunting(pair[1], pair[0]);
    });

    // 6.2 海燕麦转化：野燕麦 → 缠魂 → 海燕麦
    create.haunting('biomesoplenty:sea_oats', 'farm_and_charm:wild_oat');

    // ========================================================================
    // 八、F&C 石磨（Create 磨盘：作物 → 面粉 + 种子）
    // ========================================================================

    // 8.1 大麦（BOP 与 F&C 均可磨）
    [ 'biomesoplenty:barley', 'farm_and_charm:barley' ].forEach(function(input) {
        create.milling([
            Item.of('farm_and_charm:flour'),
            CreateItem.of('farm_and_charm:flour', 0.25),
            CreateItem.of('farm_and_charm:barley_seeds', 0.25)
        ], input).processingTime(150);
    });

    // 8.2 燕麦 → 面粉 + 燕麦种子
    create.milling([
        Item.of('farm_and_charm:flour'),
        CreateItem.of('farm_and_charm:flour', 0.25),
        CreateItem.of('farm_and_charm:oat_seeds', 0.25)
    ], 'farm_and_charm:oat').processingTime(150);

    // 8.3 海燕麦 → 面粉 + 燕麦种子（进入燕麦体系的唯一入口）
    create.milling([
        CreateItem.of('farm_and_charm:flour', 0.25),
        CreateItem.of('farm_and_charm:oat_seeds', 0.25)
    ], 'biomesoplenty:sea_oats').processingTime(150);

    // 8.4 大麦互转
    event.shapeless('farm_and_charm:barley', ['biomesoplenty:barley']);
    event.shapeless('biomesoplenty:barley', ['farm_and_charm:barley']);

    // ========================================================================
    // 九、F&C 野生采集物 Create 加工
    // ========================================================================

    // 9.1 荨麻 → 石磨 → 绿色染料（叶绿素提取）
    create.milling('minecraft:green_dye', 'farm_and_charm:wild_nettle').processingTime(150);

    // 9.2 车前草 → 粉碎 → 骨粉（替代 F&C 干燥架路线）
    create.crushing([
        Item.of('minecraft:bone_meal'),
        CreateItem.of('minecraft:bone_meal', 0.25)
    ], 'farm_and_charm:wild_ribwort').processingTime(200);

    // ========================================================================
    // 十一、F&C 菜肴 → KC 配方
    // ========================================================================

    function ing(v) { return v[0] == '#' ? { tag: v.substr(1) } : { item: v }; }

    // ——— 茶（teapot）
    var FNC_TEAS = [
        ['farm_and_charm:wild_nettle',  'farm_and_charm:nettle_tea'],
        ['farm_and_charm:wild_ribwort', 'farm_and_charm:ribwort_tea'],
        ['#farm_and_charm:strawberry',  'farm_and_charm:strawberry_tea'],
    ];
    FNC_TEAS.forEach(function(e) {
        event.custom({ type: 'kaleidoscope_cookery:teapot', ingredient: ing(e[0]), result: { id: e[1] }, tea_fluid: 'minecraft:water', time: 240 });
    });

    // ——— 汤（flex_stockpot，模糊无序）
    var FNC_SOUPS = [
        ['farm_and_charm:barley_soup',       ['#farm_and_charm:barley', 'minecraft:egg'], 1],
        ['farm_and_charm:corn_grits',        ['#farm_and_charm:corn', '#farm_and_charm:flour'], 1],
        ['farm_and_charm:goulash',           ['#farm_and_charm:onion', '#farm_and_charm:cooked_beef', 'farm_and_charm:simple_tomato_soup', 'minecraft:carrot', 'minecraft:potato'], 1],
        ['farm_and_charm:onion_soup',        ['#farm_and_charm:bread', '#farm_and_charm:onion'], 1],
        ['farm_and_charm:potato_soup',       ['minecraft:potato', '#farm_and_charm:onion'], 1],
        ['farm_and_charm:simple_tomato_soup',['#farm_and_charm:tomato', 'minecraft:sugar'], 1],
        ['farm_and_charm:yeast',             ['minecraft:sugar', 'minecraft:wheat'], 8],
    ];
    FNC_SOUPS.forEach(function(e) {
        event.custom({ type: 'kaleidoscope_cookery:flex_stockpot', carrier: { item: 'minecraft:bowl' }, ingredients: e[1].map(ing), result: { id: e[0], count: e[2] }, soup_base: 'minecraft:water' });
    });

    // ——— 锅（pot，全部需碗 carrier）
    var FNC_STOVE = [
        // stove 组
        ['farm_and_charm:baked_lamb_ham',             ['#farm_and_charm:cabbage', 'farm_and_charm:lamb_ham'], 1],
        ['farm_and_charm:farmers_bread',               ['#farm_and_charm:dough'], 3],
        ['farm_and_charm:grandmothers_strawberry_cake',               ['#farm_and_charm:dough', '#farm_and_charm:strawberry', 'minecraft:sugar'], 3],
        ['farm_and_charm:pasta_with_onion_sauce',      ['#farm_and_charm:onion', '#farm_and_charm:onion', '#farm_and_charm:pasta'], 4],
        ['farm_and_charm:potato_with_roast_meat',      ['minecraft:potato', 'minecraft:beef', 'minecraft:honey_bottle'], 2],
        ['farm_and_charm:roasted_chicken',             ['#farm_and_charm:pasta', 'farm_and_charm:chicken_parts', 'minecraft:carrot'], 3],
        ['farm_and_charm:roasted_corn',                ['#farm_and_charm:corn', '#farm_and_charm:corn', '#farm_and_charm:butter'], 1],
        ['farm_and_charm:stuffed_chicken',             ['#farm_and_charm:onion', 'minecraft:chicken', 'minecraft:carrot'], 1],
        ['farm_and_charm:stuffed_rabbit',              ['#farm_and_charm:onion', 'minecraft:rabbit', 'minecraft:carrot'], 1],
    ];
    FNC_STOVE.forEach(function(e) {
        event.custom({ type: 'kaleidoscope_cookery:flex_pot', carrier: { item: 'minecraft:bowl' }, ingredients: e[1].map(ing), result: { id: e[0], count: e[2] } });
    });
    //event.custom({ type: 'kaleidoscope_cookery:flex_pot', ingredients: ['#farm_and_charm:dough', '#farm_and_charm:strawberry', 'minecraft:sugar'].map(ing), result: { id: 'farm_and_charm:grandmothers_strawberry_cake', count: 2 } });
    var FNC_ROASTER = [
        // roaster 组
        ['farm_and_charm:bacon_with_eggs',             ['farm_and_charm:bacon', 'farm_and_charm:bacon', 'minecraft:egg', 'minecraft:egg', '#farm_and_charm:butter'], 3],
        ['farm_and_charm:barley_patties_with_potatoes',['#farm_and_charm:barley', '#farm_and_charm:barley', 'minecraft:potato', '#farm_and_charm:butter', 'minecraft:egg', '#farm_and_charm:cabbage'], 2],
        ['farm_and_charm:beef_patty_with_vegetables',  ['minecraft:beef', 'minecraft:carrot', '#farm_and_charm:butter', 'minecraft:potato', 'minecraft:beetroot', '#farm_and_charm:cabbage'], 2],
        ['farm_and_charm:chicken_wrapped_in_bacon',    ['farm_and_charm:bacon', 'farm_and_charm:chicken_parts', '#farm_and_charm:pasta', '#farm_and_charm:butter'], 1],
        ['farm_and_charm:cooked_cod',                  ['minecraft:carrot', '#farm_and_charm:cabbage', 'minecraft:cod', '#farm_and_charm:butter'], 1],
        ['farm_and_charm:cooked_salmon',               ['#farm_and_charm:corn', '#farm_and_charm:cabbage', 'minecraft:salmon', '#farm_and_charm:butter'], 1],
        ['farm_and_charm:lamb_with_corn',              ['minecraft:carrot', '#farm_and_charm:corn', 'farm_and_charm:lamb_ham', '#farm_and_charm:butter'], 1],
        ['farm_and_charm:oat_pancake',                 ['#farm_and_charm:oat', '#farm_and_charm:oat', '#farm_and_charm:oat', '#farm_and_charm:dough', '#farm_and_charm:butter', '#farm_and_charm:strawberry'], 3],
        ['farm_and_charm:sausage_with_oat_patty',      ['#farm_and_charm:oat', '#farm_and_charm:butter', 'minecraft:potato', 'minecraft:carrot', 'farm_and_charm:minced_beef', 'farm_and_charm:minced_beef'], 2],
    ];
    FNC_ROASTER.forEach(function(e) {
        event.custom({ type: 'kaleidoscope_cookery:pot', carrier: { item: 'minecraft:bowl' }, ingredients: e[1].map(ing), result: { id: e[0], count: e[2] } });
    });

    // Create 混合（替代 F&C Crafting Bowl）
    create.mixing('4x farm_and_charm:butter', Ingredient.of('#farm_and_charm:milk'));
    create.mixing('5x farm_and_charm:dough', [Ingredient.of('#c:flour'), Item.of('farm_and_charm:yeast'), Item.of('minecraft:potion')]);
    create.mixing('2x farm_and_charm:farmer_salad', [Ingredient.of('#farm_and_charm:tomato'), Ingredient.of('#farm_and_charm:onion'), Ingredient.of('#farm_and_charm:cabbage'), Ingredient.of('#farm_and_charm:strawberry')]);
});


// ============================================================================
// 十、标签统一
// ============================================================================
ServerEvents.tags('item', function (event) {

    // 10.1 F&C 谷物标签（用于石磨互通）
    event.add('c:grains', 'biomesoplenty:barley');
    event.add('c:grains', 'farm_and_charm:barley');
    event.add('c:grains', 'farm_and_charm:oat');
    event.add('c:grains/barleys', 'biomesoplenty:barley');
    event.add('c:grains/barleys', 'farm_and_charm:barley');
    event.add('c:grains/oats', 'farm_and_charm:oat');

});
