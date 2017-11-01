/**
 * Created by zhangjing on 2017/10/19.
 */
import React,{PureComponent} from 'react'
import { StyleSheet, View, Text,FlatList,Platform,RefreshControl,TouchableOpacity,TouchableNativeFeedback,Image} from 'react-native'
import {connect} from 'dva-no-router'
import theme from '../../constants/theme'
import px2dp from '../../utils/px2dp'
import getCorrectImageSizeUrl from '../../utils/imageFactory'
import Avatar from '../home/components/Avatar'
import Footer from '../../components/ListViewFooter'
import Icon from 'react-native-vector-icons/Ionicons';
class Find extends PureComponent{
    constructor(props){
        super(props)
        this.tabNames = [['Android','iOS','前端','App'],['休息视频','拓展资源','瞎推荐','福利']];
        this.tabIcon = [['logo-android','logo-apple','logo-chrome','ios-apps'],['ios-film','ios-book','ios-radio','ios-images']];
        this.tabColor = [['rgb(141,192,89)','#000','rgb(51,154,237)','rgb(249,89,58)'],['#9370db','#00ced1','#ffa500','lightpink']];
    }
    render(){
        return (
            <View style={[styles.container, {backgroundColor: this.props.pageBackgroundColor}]}>
                <FlatList
                    keyExtractor={(item,index)=>{item._id+index}}
                    data={this.props.results}
                    renderItem={this._renderRow.bind(this)}
                    ItemSeparatorComponent={this._renderSeparator.bind(this)}
                    ListHeaderComponent={this._renderHeader.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    initialNumToRender={10}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isLoading}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor={this.props.mainThemeColor}
                            colors={[this.props.mainThemeColor]}
                            title="玩命加载中..."
                        />}
                />
            </View>
        )
    }
    componentDidMount(){
        this.props.initdata({pagenum:20})
    }

    _onRefresh(){
        this.props.initdata({pagenum:20})
    }

    _onEndReached(){
        this.props.moredata({pagenum:20})
    }
    _renderHeader(){
        const {rowItemBackgroundColor, segmentColor, subTitleColor} = this.props;
        return(
            <View>
                <View style={[styles.btnPanel, {backgroundColor: rowItemBackgroundColor, borderBottomColor: segmentColor, borderTopColor: segmentColor}]}>
                    {this.tabNames.map((item, i)=>{
                        return(
                            <View style={styles.btnRow} key={i}>
                                {this.tabNames[i].map((subItem, index) => {
                                    return(
                                        <View style={styles.btnCell} key={subItem}>
                                            <TouchableOpacity
                                                onPress={this._itemPressCallback.bind(this, subItem)}
                                                activeOpacity={theme.touchableOpacityActiveOpacity}>
                                                {this._renderBtnContent(i,index)}
                                            </TouchableOpacity>
                                            <Text style={[styles.btnCellLabel, {color: this.props.titleColor}]}>{subItem}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })}
                </View>
                {this.props.isLoading ?
                    <View style={[styles.fakeListViewHeader, {backgroundColor: rowItemBackgroundColor, borderBottomColor: segmentColor, borderTopColor: segmentColor}]}>
                        <Icon name="md-aperture" color={subTitleColor} size={px2dp(16)}/>
                        <Text style={{color: subTitleColor, marginLeft: px2dp(5)}}>刷新中...</Text>
                    </View>
                    :
                    <View style={[styles.fakeListViewHeader, {backgroundColor: rowItemBackgroundColor, borderBottomColor: segmentColor, borderTopColor: segmentColor}]}>
                        <Icon name="md-aperture" color={subTitleColor} size={px2dp(16)}/>
                        <Text style={{color: subTitleColor, marginLeft: px2dp(5)}}>随机干货</Text>
                    </View>
                }
            </View>
        )
    }
    _renderBtnContent(i, index){
        return(
            <View style={{width:px2dp(50), height:px2dp(50), alignItems:'center', justifyContent:'center'}}>
                <Avatar icon={this.tabIcon[i][index]} width={px2dp(50)} backgroundColor={this.tabColor[i][index]}/>
            </View>
        );
    }
    _renderFooter(){
        const {isRenderFooter, tabIconColor} = this.props;
        return(
            <Footer indicatorColor={tabIconColor} isFullData={false} isRenderFooter={isRenderFooter}/>
        );
    }
    _renderRow({item}){
        if(Platform.OS === 'android') {
            return(
                <TouchableNativeFeedback
                    overflow="hidden"
                    onPress={this._itemOnPress.bind(this, item)}>
                    {this._renderRowContent(item)}
                </TouchableNativeFeedback>
            );
        }else if(Platform.OS === 'ios'){
            return(
                <TouchableHighlight
                    overflow="hidden"
                    onPress={this._itemOnPress.bind(this, item)}
                    underlayColor={theme.touchableHighlightUnderlayColor}>
                    {this._renderRowContent(item)}
                </TouchableHighlight>
            );
        }}

    _renderRowContent(item){
        const {titleColor, subTitleColor, rowItemBackgroundColor, thumbnailColor} = this.props;
        return(
            <View key={item._id} style={[styles.itemContainer, {backgroundColor: rowItemBackgroundColor}]}>
                <View style={styles.txtPart}>
                    <View style={styles.titlePart}>
                        <Text style={[styles.title, {color: titleColor}]} numberOfLines={2}>{item.desc}</Text>
                    </View>
                    <View style={[styles.infoPart]}>
                        <Icon name="ios-pricetag-outline" color={subTitleColor}/>
                        <Text style={[styles.detailsLabel, {color: subTitleColor}]}>{item.type}</Text>
                        <Icon name="ios-create-outline" color={subTitleColor}/>
                        <Text style={[styles.detailsLabel, {color: subTitleColor}]}>{item.who ? item.who : 'null'}</Text>
                        <Icon name="ios-time-outline" color={subTitleColor}/>
                        <Text style={[styles.detailsLabel, {color: subTitleColor}]}>{this._handleCreateTime(item.publishedAt)}</Text>
                    </View>
                </View>

            </View>
        );
    }
    _renderSeparator({index}){
        return(
            <View key={index} style={{height: theme.segment.width, width: theme.screenWidth, flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: this.props.segmentColor}}/>
            </View>
        );
    }

    _handleCreateTime(time){
        return time.substring(0, 10);
    }

    _itemPressCallback(title){

    }

    _pushScene(component, title){
        this.props.navigator.push({
            component: component,
            args: {title: title, navigator: this.props.navigator}
        });
    }

    _itemOnPress(item){
        // this.props.navigator.push({
        //     component: WebViewPage,
        //     args: {rowData: rowData}
        // });
        this.props.navigation.navigate("WebViewPage",{rowData:item})
    }
}
function mapStateToProps(state) {
    const {isLoading,results,error,thumbnailColor,isRenderFooter}=state.find;
    const {rowItemBackgroundColor, segmentColor, subTitleColor,mainThemeColor}=state.navigation
    return {isLoading,results,error,rowItemBackgroundColor, segmentColor, subTitleColor,mainThemeColor,thumbnailColor,isRenderFooter}
}

function mapDispatchToProps(dispatch) {
    return{
        initdata(params){
            dispatch({
                type:'find/initData',
                payload:params
            })
        },
        moredata(params){
            dispatch({
                type:'find/moreData',
                payload:params
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnPanel: {
        height: px2dp(215),
        width: theme.screenWidth,
        marginTop: px2dp(0),
        marginBottom: px2dp(15),
        borderBottomWidth: theme.segment.width,
        borderTopWidth: theme.segment.width,
        padding: px2dp(17),
    },
    btnRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCellLabel: {
        marginTop: px2dp(4),
    },
    itemContainer: {
        flexDirection: 'row',
        width: theme.screenWidth,
        height: px2dp(73)
    },
    imgPart: {
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: px2dp(5)
    },
    image: {
        width: px2dp(60),
        height: px2dp(60),
        resizeMode: 'cover'
    },
    txtPart: {
        flex: 80,
        paddingTop: px2dp(10),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(5),
        paddingBottom: px2dp(10)
    },
    titlePart: {
        flex: 70,
    },
    infoPart: {
        flex: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: px2dp(16)
    },
    detailsLabel: {
        marginLeft: px2dp(3),
        marginRight: px2dp(13),
        fontSize: px2dp(10)
    },
    footer: {
        flexDirection: 'row',
        width: theme.screenWidth,
        height: px2dp(60),
        alignItems: 'center',
        justifyContent: 'center',
    },
    fakeListViewHeader: {
        flexDirection: 'row',
        padding: px2dp(8),
        borderBottomWidth:theme.segment.width,
        borderTopWidth: theme.segment.width,
        alignItems: 'center'
    }
});
export default connect(mapStateToProps,mapDispatchToProps)(Find)