const

page_editor = ({ article: { title = '', description = '', body = '', tagList = [] } = {}, errors = [] } = {}) => `
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          ${error_messages(errors)}
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input name="title" value="${title}" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input name="description" value="${description}" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea name="body" class="form-control" rows="8" placeholder="Write your article (in markdown)">${body}</textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input name="tagList" value="${tag_list_to_str(tagList)}" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button type="button" id="publish-article" class="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
`,

tag_list_to_str = tag_list => tag_list.join ? tag_list.join(' ') : tag_list