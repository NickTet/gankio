/**
 * Created by zhangjing on 2017/10/23.
 */
import React from 'react'
import {Text,StyleSheet,View,TouchableOpacity} from 'react-native'
import colors from '../../../constants/colors'
import px2dp from '../../../utils/px2dp'
import Icon from 'react-native-vector-icons/Ionicons';
function ItemView({rowItemBackgroundColor,subTitleColor,rowData,titleColor,navigation}) {
    return (
        <TouchableOpacity onPress={()=>{navigation.navigate("WebViewPage",{rowData:rowData})}}>
        <View style={[styles.rowItem, {backgroundColor: rowItemBackgroundColor}]}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Icon name="ios-create-outline" color={subTitleColor}/>
                <Text style={{fontSize: px2dp(10), color: subTitleColor}}> {rowData.who ? rowData.who : 'null'}</Text>
            </View>
            <Text style={[styles.rowContent, {color: titleColor}]} numberOfLines={2}>{rowData.desc}</Text>
        </View>
        </TouchableOpacity>
    )
}
const styles=StyleSheet.create(
    {
        container:{
            flex:1,
            backgroundColor:colors.white
        },
        rowItem: {
            paddingTop: px2dp(10),
            paddingBottom: px2dp(10),
            paddingLeft: px2dp(15),
            paddingRight: px2dp(15),
            justifyContent: 'center'
        },
        rowContent: {
            fontSize: px2dp(14)
        },
        author:{

        }
    }
);
export default ItemView