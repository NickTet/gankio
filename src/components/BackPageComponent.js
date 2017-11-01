/**
 * Created by wangdi on 20/11/16.
 */
import React, {Component} from 'react';
import {BackHandler} from 'react-native';

export default class PageComponent extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack.bind(this));
    }

    _handleBack() {
        const navigation = this.props.navigation;
        if (navigation) {
            navigation.goBack()
            return true;
        }
        return false;
    }
}