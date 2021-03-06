const

page_article_template = is_author => ({ article, comments }) => `
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>${article.title}</h1>
        ${is_author ? article_meta_author(article) : article_meta(article)}
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          ${article.body}
        </div>
      </div>
      <hr />
      <div class="article-actions">
        ${is_author ? article_meta_author(article) : article_meta(article)}
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea name="body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
              <button id="add-comment" data-slug="${article.slug}" class="btn btn-sm btn-primary">Post Comment</button>
            </div>
          </form>
          ${render_many(comments, article_comment)}
        </div>
      </div>
    </div>
  </div>
`,

article_comment = ({ body, updatedAt, author: { username, image } }) => `
  <div class="card">
    <div class="card-block">
      <p class="card-text">${body}</p>
    </div>
    <div class="card-footer">
      <a href="/#/${username}" class="comment-author">
        <img src="${image}" class="comment-author-img" />
      </a>
      &nbsp;
      <a href="/#/${username}" class="comment-author">${username}</a>
      <span class="date-posted">${date_to_str(updatedAt)}</span>
    </div>
  </div>
`,

article_meta = ({ slug, updatedAt, favorited, favoritesCount, author: { username, image, following } }) => `
  <div class="article-meta">
    <a href="/#/${username}"><img src="${image}" /></a>
    <div class="info">
      <a href="/#/${username}" class="author">${username}</a>
      <span class="date">${date_to_str(updatedAt)}</span>
    </div>
    ${following ? unfollow_button({ username }) : follow_button({ username })}
    &nbsp;&nbsp;
    ${favorited ? unfavorite_button({ slug, favoritesCount }) : favorite_button({ slug, favoritesCount })}
  </div>
`,

article_meta_author = ({ slug, updatedAt, author: { username, image } }) => `
  <div class="article-meta">
    <a href="/#/${username}"><img src="${image}" /></a>
    <div class="info">
      <a href="/#/${username}" class="author">${username}</a>
      <span class="date">${date_to_str(updatedAt)}</span>
    </div>
    <button id="edit-button" data-slug="${slug}" class="btn btn-sm btn-outline-secondary">
      <i class="ion-edit"></i>
      &nbsp;
      Edit Article
    </button>
    <button id="delete-button" data-slug="${slug}" class="btn btn-sm btn-outline-danger">
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Article
    </button>
    &nbsp;&nbsp;
  </div>
`,

favorite_button = ({ slug, favoritesCount }) => `
  <button data-slug="${slug}" class="favorite-button btn btn-sm btn-outline-primary">
    <i class="ion-heart"></i>
    &nbsp;
    Favorite Article <span class="counter">(${favoritesCount})</span>
  </button>
`,

unfavorite_button = ({ slug, favoritesCount }) => `
  <button data-slug="${slug}" class="unfavorite-button btn btn-sm btn-primary">
    <i class="ion-heart"></i>
    &nbsp;
    Unfavorite Article<span class="counter">(${favoritesCount})</span>
  </button>
`,

follow_button = ({ username }) => `
  <button id="follow-user" class="btn btn-sm btn-outline-secondary" data-username="${username}">
    <i class="ion-plus-round"></i>&nbsp; Follow ${username}
  </button>
`,

unfollow_button = ({ username }) => `
  <button id="unfollow-user" class="btn btn-sm btn-secondary" data-username="${username}">
    <i class="ion-plus-round"></i>&nbsp; Unfollow ${username}
  </button>
`,

page_article = page_article_template(false),

page_article_author = page_article_template(true)
