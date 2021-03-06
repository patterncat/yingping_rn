/**
 * Created by Ron on 18/5/2016.
 */
"use strict";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView
} from 'react-native';

import MovieCollectionCell from './cell/MovieCollectionCell'
import MovieDetail from '../MovieDetail'
import React, { Component , PropTypes } from 'react';
import CommonModules,{
  ThemeStyle,
  LoadingWidget,
  fetchUsBox
} from '../../utils/CommonModules'

class UsBox extends Component {

  componentWillReceiveProps(nextProps){
    this.forceRefreshListView()
  }

  forceRefreshListView(){
    if (this.state.json){
      var newArray = JSON.parse(JSON.stringify(this.state.json));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray),
        json: newArray,
      })
    }
  }

  // 默认属性
  static defaultProps = {};

  // 属性类型
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      json: undefined,
      loaded: false,
    };
    this._renderRow = this._renderRow.bind(this);
  }



  componentDidMount() {
    fetchUsBox((json,error) => {
      if(error){
        console.log(error)
      }else {
        this.setState({
          loaded: true,
          json: json,
          dataSource: this.state.dataSource.cloneWithRows(json)
        });
      }
    })
  }

  _renderRow(rowData, sectionID, rowID ){
    return (
      <MovieCollectionCell {...this.props} movie={rowData} rowID={rowID} handler={() => {

          this.props.navigator.push({
                  component: MovieDetail,
                    params: {
                        movie: rowData
                    }
          })

      }}/>
    )
  }

  // 渲染
  render() {

    const {_theme} = this.props

    const backgroundColor = ThemeStyle[_theme].color.listBackground

    if (this.state.loaded){

      return (
        <ListView contentContainerStyle={[styles.list,{backgroundColor:backgroundColor}]}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
        />
      );

    }else {
      return (
        <LoadingWidget {...this.props}/>
      )
    }
  }

}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

export default UsBox;
