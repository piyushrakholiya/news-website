import React, { Component } from "react";
import NewsItem from "./NewsItem";
import LoadingBar from "react-top-loading-bar";

export class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      error: null,
      progress: 0,
      nextPage: null,
      loadingMore: false,
    };
  }

  componentDidMount() {
    this.fetchNews();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // અહીં removeEventListener હોવું જરૂરી છે
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState({ nextPage: null });
      window.scrollTo(0,0);
      this.fetchNews();
    }
  }

  // handleScroll ને ક્લાસની અંદર યોગ્ય રીતે ડિફાઇન કર્યું છે
  handleScroll = () => {
    if (this.state.loading || this.state.loadingMore || !this.state.nextPage) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      this.fetchNews(true);
    }
  };

  async fetchNews(loadingMore = false) {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;

    // કેટેગરી હોય કે ના હોય, હિન્દી અને ઇન્ડિયાના ન્યૂઝ માટે કોમન URL લોજિક
    let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=in&language=hi`;

    if (this.props.category) {
      url += `&category=${this.props.category}`;
    }

    if (loadingMore && this.state.nextPage) {
      url += `&page=${this.state.nextPage}`;
    } else {
      this.setState({
        loading: true,
        progress: 30,
      });
    }

    if (loadingMore) {
      this.setState({ loadingMore: true });
    }

    try {
      let data = await fetch(url);

      if (!loadingMore) {
        this.setState({
          progress: 70,
        });
      }

      if (!data.ok) {
        throw new Error(`HTTP Error: ${data.status}`);
      }

      let parsedData = await data.json();

      if (!Array.isArray(parsedData.results)) {
        throw new Error(parsedData.message || "News not found");
      }

      this.setState({
        articles: loadingMore ? [...this.state.articles, ...parsedData.results] : parsedData.results,
        nextPage: parsedData.nextPage || null,
        loading: false,
        loadingMore: false,
        progress: 100,
      });
    } catch (error) {
      console.log("API Error:", error);

      this.setState({
        articles: [],
        loading: false,
        loadingMore: false,
        error: error.message,
        progress: 100,
      });
    }
  }

  render() {
    return (
      <>
        <LoadingBar
          color="#f11946"
          progress={this.state.progress}
          onLoaderFinished={() => {
            this.setState({ progress: 0 });
          }}
        />

        <div className="container my-3">
          <h2>my News</h2>

          <div className="row">
            {this.state.articles.map((element, index) => {
              return (
                <div className="col-md-4" key={element.article_id || index}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={element.description}
                    imageUrl={element.image_url}
                    url={element.link}
                  />
                </div>
              );
            })}
          </div>

          {/* જ્યારે બીજા ન્યૂઝ નીચે લોડ થતા હોય ત્યારે સ્પીનર દેખાડવા */}
          {this.state.loadingMore && (
            <div className="text-center my-4">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default News;
