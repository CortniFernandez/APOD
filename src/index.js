import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const today = new Date().toLocaleDateString('en-CA');

class Apod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more: 'Loading images...',
      fardate: '',
    }
    this.getImages = this.getImages.bind(this);
    this.seeMore = this.seeMore.bind(this);
    this.setInitialTimeRange = this.setInitialTimeRange.bind(this);
  }

  setInitialTimeRange() {
    let tempdate = new Date();
      tempdate.setDate(tempdate.getDate()-4);
    this.setState({fardate: tempdate.toLocaleDateString('en-CA')}, () => {
      let fardate = this.state.fardate;
      this.getImages(fardate, today)
    });
  }
  
  getImages(fardate, neardate) {
    fetch('https://api.nasa.gov/planetary/apod?api_key=7as3e1SZ4IJIWeXsY1m3NbJgsIhbR0ZMHTqklCsq&start_date=' + fardate + '&end_date=' + neardate)
      .then(response => response.json())
      .then(data => {
        JSON.stringify(data);
        console.log(data);
        data.reverse();
        data.map(obj => {
          let section = document.createElement('section');
          section.className = 'section';

          let media = document.createElement('div');
          media.className = 'media-box';

          let title = document.createElement('h2');
          title.textContent = obj.title;
          title.className = 'title';
          if (obj.media_type == 'image') {
            let img = document.createElement('img');
            img.src = obj.url;
            img.className = 'responsive-image';
            media.append(img);
          } else if (obj.media_type == 'video') {
            let div = document.createElement('div');
            div.className = 'iframe-div';
            let iframe = document.createElement('iframe');
            iframe.src = obj.url;
            iframe.className = 'responsive-iframe';
            div.append(iframe);
            media.append(div);
          }
          media.append(title);
          
          let infobox = document.createElement('div');
          infobox.className = 'infobox';
          let date = document.createElement('p');
          date.textContent = obj.date;
          date.className = 'date';
          let like = document.createElement('button');
          like.className = 'like-button';
          let heart = document.createElement('i');
          heart.className = 'fas fa-heart';
          heart.addEventListener('click', function(e){e.target.classList.toggle('liked')});
          like.append(heart);
          let twitter = document.createElement('button');
          twitter.className = 'twitter-btn';
          twitter.innerHTML = `<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false"><i class="fab fa-twitter"></i></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
          infobox.append(date,like,twitter);
          
          let desc = document.createElement('div');
          desc.className = 'desc';
          desc.textContent = obj.explanation;
          desc.addEventListener('click', function(e){e.target.classList.toggle('read-more')});

          section.append(media,infobox,desc);
          document.getElementById('url-list').append(section);
        })
        this.setState({more: 'See more'});
      })
    
  }
  
  seeMore() {
    let tempnear = new Date(this.state.fardate); 
    let neardate = tempnear.toLocaleDateString('en-CA');
    let tempfar = new Date(this.state.fardate);
      tempfar.setDate(tempfar.getDate()-5);
    let fardate = tempfar.toLocaleDateString('en-CA');
    this.setState({fardate: fardate}, () => {
      this.getImages(fardate, neardate);
    });
  }
  
  componentDidMount() {
    this.setInitialTimeRange();
  }
  
  render() {
    return (
      <div>
        <div id='url-list'></div>
        <div onClick={this.seeMore} className='see-more'>{this.state.more}</div>
      </div>
    )
  }
  
}

ReactDOM.render(
  <Apod />,
  document.getElementById('root')
)