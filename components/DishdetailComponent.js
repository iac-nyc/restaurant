import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});


function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{ flexDirection: 'row',        justifyContent: 'center' }}>
                    <Icon raised reverse name={props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8'
                        onPress={() => props.onPressComment()}
                    />
                </View>
            </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{ paddingVertical: 10, alignSelf: 'flex-start' }}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}                   

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
           favorites: [],
           showModal: false,
           rating: 1,
            author: '',
            comment: ''
        };
    };
    
 toggleCommentModal() {
        this.setState({ showModal: !this.state.showModal });
    };    

       
 markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }   

    static navigationOptions = {
        title: 'Dish Details'
    };
handleCommentSubmit() {
        console.log('Rating: ' + this.state.rating + '\nAuthor: ' + this.state.author + '\nComment: ' + this.state.comment);
        this.setState({
            rating: 1,
            author: '',
            comment: ''
        });
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onPressComment={() => this.toggleCommentModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                    
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleCommentModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            type="star"
                            startingValue={1}
                            imageSize={40}
                            onFinishRating={(rating) => {this.setState({ rating: rating})}}
                            onStartRating={this.ratingStarted}
                            style={{ paddingVertical: 10 }}
                        />
          
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                             onChangeText={(text) => this.setState({ author: text })} value={this.state.author}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(text) => this.setState({ comment: text })} value={this.state.comment}
                        />
                        <View style={styles.modal}>       
                            <Button style={styles.formRow}
                                onPress={() => { this.handleCommentSubmit(); this.toggleCommentModal(); }}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={styles.modal}>
                             <Button
                                onPress={() => { this.toggleCommentModal() }}
                                 color="#B8B8B8"
                                title="Cancel"
                            /> 
                        </View>
                    </View>
                </Modal>    
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
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);