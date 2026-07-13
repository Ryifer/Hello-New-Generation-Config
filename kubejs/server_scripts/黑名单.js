// 禁止荧光液桶的右键倒出行为
ItemEvents.rightClicked(event => {
    const { item } = event
    // 检查物品 ID
    if (item.id === 'supplementaries:lumisene_bucket') {
        // 取消这次右键交互，阻止倒出液体
        event.cancel()
        // 可选: 给玩家一个简单的反馈
        event.player.tell(Text.red("荧光液桶已被禁用，无法倒出"))
    }
})