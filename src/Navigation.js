/**
 * Created by zhangjing on 2017/10/19.
 */
import Find from './pages/find/Find'
import Home from './pages/home/Home'
import More from './pages/more/More'
import Collect from './pages/collect/collect'
import Icon from 'react-native-vector-icons/Ionicons';
import React, {Component} from 'react';
import theme from './constants/theme';
import {StyleSheet, Platform, View, Text, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import px2dp from './utils/px2dp';
import {connect} from 'dva-no-router'

class Navigation extends Component{

    render(){
        console.log(this.props.navigation)
        return(
            <BottomTabBar
                navigation={this.props.navigation}
                mainThemeColor={this.props.mainThemeColor}
                rowItemBackgroundColor={this.props.rowItemBackgroundColor}
                tabIconColor={this.props.tabIconColor}
            />
        );
    }
}

class BottomTabBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTab: 'home'
        };
    }

    _renderItem(Component, tab, tabName, normalIcon, selectedIcon){
        const {navigation, tabIconColor} = this.props;
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === tab}
                title={tabName}
                selectedTitleStyle={{color: tabIconColor}}
                renderIcon={() => <Image style={styles.tabBarItemIcon} source={normalIcon} />}
                renderSelectedIcon={() => <Image style={[styles.tabBarItemIcon, {tintColor: tabIconColor}]} source={selectedIcon} />}
                onPress={() => this.setState({ selectedTab: tab })}>
                {<Component navigation={navigation}/>}
            </TabNavigator.Item>
        );
    }

    render(){
        return(
            <TabNavigator
                hidesTabTouch={true}
                tabBarStyle={[styles.tabBarStyle, {backgroundColor: this.props.rowItemBackgroundColor}]}
                sceneStyle={{
                    paddingTop: theme.toolbar.paddingTop, //immersive experience
                    paddingBottom: styles.tabBarStyle.height}}>
                {this._renderItem(Home, 'home', '首页', this.state.homeNormal, this.state.homeSelected)}
                {this._renderItem(Find, 'discovery', '发现', this.state.compassNormal, this.state.compassSelected)}
                {this._renderItem(Collect, 'collection', '收藏', this.state.collectionNormal, this.state.collectionSelected)}
                {this._renderItem(More, 'more', '更多', this.state.moreNormal, this.state.moreSelected)}
            </TabNavigator>
        );
    }

    componentWillMount(){
        const tabIconColor = this.props.tabIconColor;
        if(Platform.OS === 'ios'){
            Icon.getImageSource('ios-home-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({homeNormal: source}));
            Icon.getImageSource('ios-home-outline', 100, tabIconColor).then((source) => this.setState({homeSelected: source}));
            Icon.getImageSource('ios-compass-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({compassNormal: source}));
            Icon.getImageSource('ios-compass-outline', 100, tabIconColor).then((source) => this.setState({compassSelected: source}));
            Icon.getImageSource('ios-list-box-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({moreNormal: source}));
            Icon.getImageSource('ios-list-box-outline', 100, tabIconColor).then((source) => this.setState({moreSelected: source}));
            Icon.getImageSource('ios-cube-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({collectionNormal: source}));
            Icon.getImageSource('ios-cube-outline', 100, tabIconColor).then((source) => this.setState({collectionSelected: source}));
        }else if(Platform.OS === 'android'){
            Icon.getImageSource('md-home', 100, theme.tabButton.normalColor).then((source) => this.setState({homeNormal: source}));
            Icon.getImageSource('md-home', 100, tabIconColor).then((source) => this.setState({homeSelected: source}));
            Icon.getImageSource('md-compass', 100, theme.tabButton.normalColor).then((source) => this.setState({compassNormal: source}));
            Icon.getImageSource('md-compass', 100, tabIconColor).then((source) => this.setState({compassSelected: source}));
            Icon.getImageSource('md-list-box', 100, theme.tabButton.normalColor).then((source) => this.setState({moreNormal: source}));
            Icon.getImageSource('md-list-box', 100, tabIconColor).then((source) => this.setState({moreSelected: source}));
            Icon.getImageSource('md-cube', 100, theme.tabButton.normalColor).then((source) => this.setState({collectionNormal: source}));
            Icon.getImageSource('md-cube', 100, tabIconColor).then((source) => this.setState({collectionSelected: source}));
        }
    }

    componentDidMount(){

        // this.props.init();
        // store.dispatch(fetchStarList());
        // store.dispatch(initialSettingsStateFacade());
    }
}
const styles = {
    tabBarItemIcon: {
        width: px2dp(20),
        height: px2dp(20)
    },
    tabBarStyle: {
        height: px2dp(45),
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? px2dp(6) : px2dp(3)
    }
}
function mapStateToProps(state) {
    const {mainThemeColor,rowItemBackgroundColor,tabIconColor}=state.navigation;
    return{mainThemeColor,rowItemBackgroundColor,tabIconColor}
}

function mapDispatchToProps(dispatch) {
    return{
        init(params){
            dispatch(
                {
                    type:'navigation/init',
                    payload:params
                }
            );
        },
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation)