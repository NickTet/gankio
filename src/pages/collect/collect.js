/**
 * Created by zhangjing on 2017/10/19.
 */
import React,{PureComponent} from 'react'
import { StyleSheet, View, Text,} from 'react-native'

export default class Collect extends PureComponent{
    render(){
        return (
            <View style={styles.container}>
            <Text>还没有收藏任何数据，找篇文章收藏吧～</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create(
    {
        container:{
            flex:1,
            alignItems:'center',
            justifyContent:'center'
        }
    }
);