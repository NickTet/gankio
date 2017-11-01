/**
 * Created by zhangjing on 2017/10/19.
 */
import React from 'react'
import dva from 'dva-no-router';
import Navigation from './Navigation'
import WebViewPage from './pages/webview/WebViewPage'
import models from './models'
import logger from 'redux-logger'
import devToolsEnhancer from 'remote-redux-devtools'
import {StackNavigator} from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
const app=dva({
    onAction:logger,
    extraEnhancers:[devToolsEnhancer({realtime: true})]
})
Object.keys(models).map(key=>app.model(models[key]));
app.router(()=><Main />);
export default app.start();

const Main=StackNavigator({
    Navigation: { screen: Navigation },
    WebViewPage: { screen: WebViewPage },
},{
    initialRouteName:'Navigation',
    navigationOptions:{
        headerStyle: {
            backgroundColor: '#2D2D2D',
        },
        headerBackTitle: null,
        headerTintColor: '#FFFFFF',
    },
    transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal, // 安卓导航进入 左右方式
    }),
    headerMode:'none'// 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
})