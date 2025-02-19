import { createApp } from 'vue'
import { Row, Col } from '@nutui/nutui-taro'
import { Grid, GridItem } from '@nutui/nutui-taro'
import { Divider } from '@nutui/nutui-taro'
import { Button } from '@nutui/nutui-taro'


import './app.scss'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(Row).use(Col)
App.use(Grid).use(GridItem)
App.use(Divider)
App.use(Button)



export default App
