const 

page_home = ({ articles, tags, articlesCount }) => `
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>

          ${render_many(articles, article_preview) || empty_articles()}

          <nav>
            <ul class="pagination">
              ${render_many_times(number_of_pages(articlesCount), pagination_link)}
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              ${render_many(tags, popular_tag)}
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
  `,

article_preview = ({ title, slug, description, favoritesCount, updatedAt, author: { image, username }}) => `
  <div class="article-preview">
    <div class="article-meta">
      <a href="/#/${username}"><img src="${image}" /></a>
      <div class="info">
        <a href="/#/${username}" class="author">${username}</a>
        <span class="date">${date_to_str(updatedAt)}</span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> ${favoritesCount}
      </button>
    </div>
    <a href="/#/article/${slug}" class="preview-link">
      <h1>${title}</h1>
      <p>${description}</p>
      <span>Read more...</span>
    </a>
  </div>
`,

popular_tag = name => `<a href="#" class="tag-pill tag-default">${name}</a>`,

pagination_link = number => `
  <li class="page-item">
    <a class="page-link" data-offset="${page_offset(number)}" href="#">
      ${number}
    </a>
  </li>
`,

render_many_times = (number, fn) => render_many(Array(number).fill(0).map((_, i) => i + 1), fn),

number_of_pages = total_articles_number => Math.ceil(total_articles_number / 20),

page_offset = number => (number - 1) * 20