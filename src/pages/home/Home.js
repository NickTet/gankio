/**
 * Created by zhangjing on 2017/10/19.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Text, ScrollView, Animated, SectionList, RefreshControl} from 'react-native'
import px2dp from '../../utils/px2dp';
import {getCurrentDate} from '../../utils/getDate';
import {connect} from 'dva-no-router'
import ImageView from './components/ImageView'
import ItemView from './components/Itemview'
import Avatar from './components/Avatar'
import colors from '../../constants/colors'
import * as dataUtil from './utils/datautil'
class Home extends PureComponent {
    constructor(props) {
        super(props)
        this.tabIcon = ['logo-android', 'logo-apple', 'logo-chrome', 'ios-film', 'ios-book', 'ios-apps', 'ios-radio'];
        this.tabColor = ['rgb(141,192,89)', '#000', 'rgb(51,154,237)', '#9370db', '#00ced1', 'rgb(249,89,58)', '#ffa500'];
        this.state = {}
        this.imageHeight = px2dp(400);
    }

    render() {
        const {results, error, mainThemeColor, pageBackgroundColor, rowItemBackgroundColor, titleColor, subTitleColor, segmentColor} = this.props;
        const itemprops = {rowItemBackgroundColor, subTitleColor, titleColor}
        const datas = [];
        Object.keys(results).filter((key)=>{return key!=='福利'}).map((key) => {
            datas.push({data: results[key],key:key})
        })
        return (
            !error ?
                <View style={{backgroundColor:pageBackgroundColor}}>
                    <SectionList
                        keyExtractor = {(item, index) => item._id}
                        ListHeaderComponent={this._headerComponent()}
                        renderItem={({item}) => <ItemView rowItemBackgroundColor={rowItemBackgroundColor} subTitleColor={subTitleColor}
                        titleColor={titleColor} rowData={item} navigation={this.props.navigation}/>}
                        ItemSeparatorComponent={this._separatorComponent}
                        renderSectionHeader={({section})=>(
                            <View style={[styles.header, {backgroundColor: colors.white,borderTopColor:"#aaa"}]}>
                                <Avatar icon={this.tabIcon[this._judgeIconAttribute(section.key)]} width={px2dp(20)}
                                        backgroundColor={this.tabColor[this._judgeIconAttribute(section.key)]}/>
                                <Text style={styles.headerLabel}>{section.key}</Text>
                            </View>
                        )
                     }
                        sections={datas}
                    ></SectionList>
                </View> : null
        )
    }

    componentDidMount() {
        const date = {date: getCurrentDate()}
        this.props.init(date);
    }
    _separatorComponent=()=>{
        return (
            <View style={[styles.container,{backgroundColor:'#aaa'},{height:1}]}>
            </View>)
    }
    _headerComponent=()=>{
        const {results, error, mainThemeColor, pageBackgroundColor, rowItemBackgroundColor, titleColor, subTitleColor, segmentColor} = this.props;
        return (<View style={[styles.container,{backgroundColor:pageBackgroundColor,height:px2dp(400)}]}>
            <ImageView imgUrl={dataUtil.getFuLiUrl(results)} labelTime={getCurrentDate()}></ImageView>
        </View>)
    }
    _onRefresh = () => {
        const date = {date: getCurrentDate()}
        this.props.init(date);
    }


    _judgeIconAttribute(hearderLabel) {
        switch (hearderLabel) {
            case 'Android':
                return 0;
            case 'iOS':
                return 1;
            case '前端':
                return 2;
            case '休息视频':
                return 3;
            case '拓展资源':
                return 4;
            case 'App':
                return 5;
            case '瞎推荐':
                return 6;
        }
    }
}
function mapStateToProps(state) {
    const {mainThemeColor, pageBackgroundColor, rowItemBackgroundColor, titleColor, subTitleColor, segmentColor}=state.navigation;
    const {results, loading, error, category}=state.home
    return {
        mainThemeColor,
        pageBackgroundColor,
        rowItemBackgroundColor,
        results,
        loading,
        error,
        category,
        titleColor,
        subTitleColor,
        segmentColor
    }
}

function mapDispatchToProps(dispatch) {
    return {
        init(params){
            dispatch(
                {
                    type: 'home/init',
                    payload: params
                }
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerLabel: {
        color: 'steelblue',
        fontSize: px2dp(17),
        marginLeft: px2dp(7)
    },
    header: {
        flexDirection: 'row',
        paddingTop: px2dp(12),
        paddingBottom: px2dp(6),
        paddingLeft: px2dp(15),
        alignItems: 'center',
        borderTopWidth:  px2dp(1)
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home)
