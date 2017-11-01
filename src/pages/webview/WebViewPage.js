/**
 * Created by zhangjing on 2017/10/27.
 */
import React, {Component,PropTypes} from 'react';
import {View,StyleSheet,WebView,InteractionManager,Text,TouchableOpacity,ActivityIndicator,Alert, Linking, Clipboard, Modal, PanResponder, Animated, ToastAndroid} from 'react-native'
import theme from '../../constants/theme'
import NavigationBar from '../../components/NavigationBar'
import ShareUtil from '../../utils/ShareUtil'
import BackPageComponent from '../../components/BackPageComponent';
import px2dp from '../../utils/px2dp'
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'dva-no-router'
class WebViewPage extends BackPageComponent{
    constructor(props){
        super(props)
        this.state = {
            didMount: false,
            showMoreContent: false,
            bottomInfoBarBottomValue: new Animated.Value(0),
            //toolbarTopValue: new Animated.Value(0)
        };
        this.bottomIconNames = ['ios-arrow-back-outline',
            'ios-arrow-forward-outline',
            'ios-refresh-outline'
        ];
        this.bottomIconSize = [px2dp(25),px2dp(25),px2dp(32)];
        this.moveYThreshold = 5;
        this.animationFlag = true;
    }

    render(){
        const {pageBackgroundColor}=this.props
        const {rowData}=this.props.navigation.state.params
        return(
            <View style={[styles.container,{backgroundColor:pageBackgroundColor}]}>
                <View style={styles.contentContainer} {...this._panResponder.panHandlers}>
                    {this.state.didMount ?
                        <WebView
                            ref={(ref)=>{this.webView = ref}}
                            style={[styles.webView, {backgroundColor: this.props.pageBackgroundColor}]}
                            source={{uri: rowData.url}}
                            renderLoading={this._renderLoading.bind(this)}
                            renderError={this._renderError.bind(this)}
                            startInLoadingState={true}
                        />
                        :
                        null
                    }
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.showMoreContent}
                    onRequestClose={this._btnOnPressCallback.bind(this, 9)}>
                    <View style={[styles.moreContentContainerBackground, {backgroundColor: 'rgba(0,0,0,0.1)'}]}>
                        <View style={[styles.moreContentContainer, {backgroundColor: this.props.rowItemBackgroundColor}]}>
                            {this._renderModalItem(0, 'ios-paper-outline', '查看完整标题')}
                            {this._renderModalItem(4, 'ios-clipboard-outline', '复制链接')}
                            {this._renderModalItem(5, 'ios-open-outline', '在浏览器中打开')}
                            {this._renderModalItem(6, 'ios-share-outline', '分享此内容')}
                            {this._renderModalItem(9, 'ios-close-circle-outline', '关闭')}
                        </View>
                    </View>
                </Modal>

                <Animated.View style={[styles.toolbar, {top: 0}]}>
                    <NavigationBar
                        title="详细内容"
                        leftBtnIcon="arrow-back"
                        leftBtnPress={this._handleBack.bind(this)}
                        rightBtnIcon="more"
                        rightBtnPress={this._btnOnPressCallback.bind(this, 9)}
                    />
                </Animated.View>
                <Animated.View style={[styles.bottomInfoBar, {bottom: this.state.bottomInfoBarBottomValue, backgroundColor: this.props.webViewToolbarColor, borderTopColor: this.props.segmentColor}]}>
                    {this.bottomIconNames.map((item, i)=>{
                        return(
                            <View key={i} style={{flex: 1, alignItems: 'center'}}>
                                <TouchableOpacity
                                    onPress={this._btnOnPressCallback.bind(this, i+1)}
                                    activeOpacity={theme.touchableOpacityActiveOpacity}>
                                    <Icon name={item} color="#1e90ff" size={this.bottomIconSize[i]} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {this.props.isStarred ?
                            <TouchableOpacity
                                onPress={this._btnOnPressCallback.bind(this, 7)}
                                activeOpacity={theme.touchableOpacityActiveOpacity}>
                                <Icon name='ios-heart' color="#32cd32" size={px2dp(25)}/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this._btnOnPressCallback.bind(this, 8)}
                                activeOpacity={theme.touchableOpacityActiveOpacity}>
                                <Icon name='ios-heart-outline' color="#32cd32" size={px2dp(25)}/>
                            </TouchableOpacity>
                        }
                    </View>
                </Animated.View>
            </View>
        )
    }
    componentWillMount(){
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                let y = gestureState.dy;
                if(y > this.moveYThreshold && this.animationFlag) { //drag down
                    if (this.state.bottomInfoBarBottomValue === px2dp(0)) return;
                    this.animationFlag = false;
                    Animated.timing(this.state.bottomInfoBarBottomValue, {
                        toValue: 0,
                        duration: 300
                    }).start(() => this.animationFlag = true);
                    // Animated.timing(this.state.toolbarTopValue, {
                    //     toValue: 0,
                    //     duration: 300
                    // }).start();
                }
                if(y < -this.moveYThreshold && this.animationFlag) {  //drag up
                    if (this.state.bottomInfoBarBottomValue === px2dp(-45)) return;
                    this.animationFlag = false;
                    Animated.timing(this.state.bottomInfoBarBottomValue, {
                        toValue: px2dp(-45),
                        duration: 300
                    }).start(() => this.animationFlag = true);
                    // Animated.timing(this.state.toolbarTopValue, {
                    //     toValue: -theme.toolbar.height,
                    //     duration: 300
                    // }).start();
                }
            }
        });
    }
    componentDidMount(){
        super.componentDidMount();
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                didMount: true
            });
        });
    }
    _btnOnPressCallback(id){
        if(id === 0){
            Alert.alert('', this.props.rowData.desc, [{text: '好的', onPress: ()=>{}}]);
        }else if(id === 1){
            this.webView.goBack();
        }else if(id === 2){
            this.webView.goForward();
        }else if(id === 3){
            this.webView.reload();
        }else if(id === 4){
            Clipboard.setString(this.props.rowData.url);
            Toast.show('已复制到剪贴板', {position: px2dp(-80)});
        }else if(id === 5){
            Linking.canOpenURL(this.props.rowData.url).then(supported => {
                if (supported) {
                    Linking.openURL(this.props.rowData.url);
                } else {
                    Toast.show('Cannot open it', {position: px2dp(-80)});
                }
            });
        }else if(id === 6){
            let share = new ShareUtil();
            share.share(this.props.rowData.desc, this.props.rowData.url);
        }else if(id === 7){
            //    刷新
        }else if(id === 8){
            //   收藏

        }else if(id === 9){
            this.setState({showMoreContent: !this.state.showMoreContent});
        }

    }
    _renderLoading(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator color={this.props.tabIconColor} size="large"/>
                <Text style={{marginTop: px2dp(10), color: this.props.tabIconColor}}>玩命加载中...</Text>
            </View>
        )
    }
    _renderError(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image style={{width:px2dp(80),height:px2dp(80)}} source={{uri:require('../../assets/user_article_no_data.png')}} resizeMode={"contain"}></Image>
                <Text>Oooops~, 出错了, 重新刷新下吧～</Text>
            </View>
        )
    }

    _renderModalItem(btnId, icon, title){
        return(
            <TouchableOpacity
                onPress={this._btnOnPressCallback.bind(this, btnId)}
                activeOpacity={theme.touchableOpacityActiveOpacity}>
                <ModalItem icon={icon} title={title} titleColor={this.props.titleColor}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        marginTop: theme.toolbar.height,
        flex: 1,
        paddingTop: theme.toolbar.paddingTop
    },
    toolbar: {
        position: 'absolute',
        width: theme.screenWidth,
        marginTop: theme.toolbar.paddingTop,
        zIndex: 1
    },
    webView: {
        flex: 1
    },
    bottomInfoBar: {
        position: 'absolute',
        height: px2dp(45),
        width: theme.screenWidth,
        borderTopWidth: theme.segment.width,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1
    },
    moreContentContainerBackground: {
        position: 'absolute',
        top: 0,
        width: theme.screenWidth,
        height: theme.screenHeight
    },
    moreContentContainer: {
        position: 'absolute',
        right: px2dp(5),
        top: theme.toolbar.height,
        width: px2dp(150),
        height: px2dp(160),
        borderRadius: 5,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5)
    },
    modalItem: {
        width: px2dp(150),
        height: px2dp(30),
        flexDirection: 'row',
        alignItems: 'center'
    }
});
function mapStateToProps(state) {
    const {pageBackgroundColor,webViewToolbarColor,rowItemBackgroundColor,titleColor,tabIconColor}=state.navigation
    return {pageBackgroundColor,webViewToolbarColor,rowItemBackgroundColor,titleColor,tabIconColor}
}
function mapDispatchToProps(dispatch) {
    return{
        star(params){
            dispatch({
                type:'star',
                payload:""
            })
        }
    }
}
class ModalItem extends Component{
    static propTypes = {
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        titleColor: PropTypes.string
    };

    render(){
        return(
            <View style={styles.modalItem}>
                <View style={{flex: 20}}>
                    <Icon name={this.props.icon} size={px2dp(20)} color={this.props.titleColor}/>
                </View>
                <View style={{flex: 80}}>
                    <Text style={{color: this.props.titleColor}}>{this.props.title}</Text>
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(WebViewPage)