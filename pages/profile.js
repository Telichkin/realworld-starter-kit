const 

profile_template = ({ profile: { username, bio, image }, articles }, favorites_selected) => `
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="${image}" class="user-img" />
            <h4>${username}</h4>
            <p>
              ${bio || ''}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow ${username} 
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link ${favorites_selected ? '' : 'active'}" href="/#/${username}">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${favorites_selected ? 'active' : ''}" href="/#/${username}/favorites">Favorited Articles</a>
              </li>
            </ul>
          </div>

          ${render_many(articles, article_preview) || empty_articles()}

        </div>

      </div>
    </div>

  </div>
`

page_profile = json => profile_template(json, false),

page_profile_favorites = json => profile_template(json, true)