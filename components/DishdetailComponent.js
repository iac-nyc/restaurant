import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button, TextInput,  Alert, PanResponder  } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, author, comment, rating) => dispatch(postComment(dishId, author, comment, rating))
});


function RenderDish(props) {

  const dish = props.dish;
    
  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
   
 const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })

  if (dish != null) {
    return (
       <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers}>
            <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
        <Text style={{ margin: 10 }}>
          {dish.description}
        </Text>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon raised reverse name={props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50' onPress={() => props.favorite ? console.log('Already favorite.') : props.onPress()} />
          <Icon raised reverse name='pencil' type='font-awesome' color='#512AD8' onPress={() => props.toggleModal() } />
        </View>
       </Card>
    </Animatable.View>
    );
  }

  else {
    return (<View></View>);
  }

}

function RenderComments(props) {
  
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return(
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Rating
          imageSize={10}
          readonly
          startingValue={parseInt(item.rating)}
          style={{marginRight: 'auto', marginTop: 3, marginBottom: 3}}
        />
        <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
      </View>
    );
  }

  return(
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
        <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        </Animatable.View>
  );

}

class Dishdetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dishId: 1,
      author: '',
      comment: '',
      rating: 1,
      showModal: false
    }

  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  handleComment(dishId) {
    console.log(JSON.stringify(this.state));
    this.props.postComment(dishId, this.state.author, this.state.comment, this.state.rating);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      dishId: 1,
      author: '',
      comment: '',
      rating: 1,
      showModal: false
    })
  }

  render() {
    const dishId = this.props.navigation.getParam('dishId','');
    console.log(this.props.comments);
    

    return (
      <ScrollView>
        <Modal animationType = {"slide"} transparent = {false}
          visible = {this.state.showModal}
          onDismiss = {() => this.toggleModal() }
          onRequestClose = {() => this.toggleModal() }
        >
          <View style = {styles.modal}>
            <Rating
              showRating
              type="star"
              startingValue={this.state.rating}
              imageSize={40}
              onStartRating={this.ratingStarted}
              onFinishRating={(rating) => this.setState({rating: rating})}
              style={{ paddingVertical: 10 }}
            />

            <View style={{flexDirection: 'row', borderBottomColor: '#a2a2a2', borderBottomWidth: 1, marginBottom: 10}}>
              <Icon name='user-o' type='font-awesome' padding={5} />
              <TextInput 
                placeholder="Author"
                value={this.state.author}
                onChangeText={(author) => this.setState({author: author})}
              />
            </View>

            <View style={{flexDirection: 'row', borderBottomColor: '#a2a2a2', borderBottomWidth: 1, marginBottom: 10}}>
              <Icon name='comment-o' type='font-awesome' padding={5} />
              <TextInput 
                placeholder="Comment"
                value={this.state.comment}
                onChangeText={(comment) => this.setState({comment: comment})}
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Button
              onPress = {() =>{this.handleComment(dishId); this.resetForm();}}
              color="#512DA8"
              title="Submit" 
              />
            </View>
            <View style={{marginBottom: 10}}>
            <Button
            onPress = {() =>{this.toggleModal(); this.resetForm();}}
            color="#B8B8B8"
            title="Cancel" 
            />
            </View>    
          </View>
        </Modal>

        <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(element => element === dishId)} onPress={() => this.markFavorite(dishId) } toggleModal={() => this.toggleModal()} />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
      </ScrollView>
    );
  }

}



const styles = StyleSheet.create({
  
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },

  formLabel: {
    fontSize: 18,
    flex: 2
  },

  formItem: {
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512AD8',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20
  },

  modalText: {
    fontSize: 18,
    margin: 10
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);