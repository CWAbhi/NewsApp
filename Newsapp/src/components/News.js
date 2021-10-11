import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        name: 'in',
        pageSize: 8,
      }
      static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes,
        category: PropTypes.string,
      }
     capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1 ,
            totalResults: 0      
         }
         document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
   }
   async componentDidMount(){
       this.props.setProgress(0);
       let url = `https://newsapi.org/v2/top-headlines?country=ca&category:{this.props.category}&apiKey=17b3d01bdf93489981792986ac254e50&page=1&pageSize=${this.props.pageSize}`;
       this.setState({loading: true});   
       let data = await fetch(url);
       let parsedData = await data.json()
       console.log(parsedData);
        this.setState({articles: parsedData.articles, loading: false})
        this.props.setProgress(100);  
    }
    handlePrevClick = async()=>{
        console.log("previous")
        let url = `https://newsapi.org/v2/top-headlines?country=in&category:{this.props.category}&apiKey=17b3d01bdf93489981792986ac254e50&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
       let data = await fetch(url);
        this.setState({loading: true});   
       let parsedData = await data.json()
       console.log(parsedData);
       this.setState({
        page: this.state.page - 1,
        articles: parsedData.articles,
        loading: false,
        totalResults: parsedData.totalResults
    })
}
   handleNextClick = async()=>{
    console.log("next");
    if (this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)){

    }
    else{
    let url = `https://newsapi.org/v2/top-headlines?country=in&category:{this.props.category}&apiKey=17b3d01bdf93489981792986ac254e50&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});   
    let data = await fetch(url);
       let parsedData = await data.json()   
       this.setState({
        page: this.state.page + 1,
        articles: parsedData.articles,
        loading: false
    })
}
}
    fetchMoreData = async() =>{
        this.setState({page: this.state.page+1});
        let url = `https://newsapi.org/v2/top-headlines?country=in&category:{this.props.category}&apiKey=17b3d01bdf93489981792986ac254e50&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
       let data = await fetch(url);  
       let parsedData = await data.json()
       console.log(parsedData);
       this.setState({
        page: this.state.page - 1,
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults
    })
    }
    render() {
        return (
         <div className="container my-3">
             <h1><center>NewsMonkey - Top Headlines</center></h1>
             {this.state.loading && <Spinner/>}
             <InfiniteScroll
                 dataLength={this.state.articles.length}
                 next={this.fetchMoreData}
                 hasMore={this.state.articles.length !== this.state.totalResults}
                 loader={<Spinner/>}
             >
                 <div className="container">
            <div className="row">
             {this.state.articles.map((element)=>{
               return <div className="col-md-4" key={element.url}>
               <NewsItem title={element.title?element.title.slice(0, 45):""} description={element.description?element.description.slice(0, 80):""} imageUrl={element.urlToImage} newsUrl={element.url}
               author={element.author} date={element.publishedAt}/>
              </div>
             })}
            </div>
            </div>
            </InfiniteScroll>
         </div>    
        )
    }
}

export default News