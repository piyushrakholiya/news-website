import React, { Component } from 'react'

export class NewsItem extends Component {
 
  render() {
   let {title, description, imageUrl, url} = this.props;
    return (
      <div className='my-3'>
        <div className="card" style={{width: "18rem"}}>
  <img src={imageUrl} className="card-img-top" alt="news"/>
  <div className="card-body">
    <h5 className="card-title">{title}</h5>
    <p className="card-text">{description}</p>
    <a href={url} className="btn btn-primary">read more</a>
  </div>
</div>
      </div>
    )
  }
}

export default NewsItem
