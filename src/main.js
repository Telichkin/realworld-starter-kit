const dispatch_hash = create_dispatch_hash([
  [
    r('#/login'),
    case_of(
      user_is_anon(render_page(page_login)),
      user_is_auth(redirect_to_user))
  ], [
    r('#/register'),
    case_of(
      user_is_anon(render_page(page_register)),
      user_is_auth(redirect_to_user))
  ], [
    r('#/settings'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(fetch_and_render(get_user, page_settings)))
  ], [
    r('#/editor'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(render_page(page_editor)))
  ], [
    r('#/editor/([^/]+)'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(fetch_and_render(get_article, page_editor)))
  ], [
    r('#/article/([^/]+)'),
    fetch_and_render(get_article_page, case_of(
      and(resp_is_success, user_is_author)(page_article_author),
      resp_is_success(page_article),
      resp_is_error(page_not_found)))
  ], [
    r('#/([^/]+)/favorites'),
    fetch_and_render(get_profile_favorites, case_of(
      resp_is_success(page_profile_favorites),
      resp_is_error(page_not_found)))
  ], [
    r('#/([^/]+)'),
    fetch_and_render(get_profile_page, case_of(
      resp_is_success(page_profile),
      resp_is_error(page_not_found)))
  ], [
    r('$|^#'),
    render_home
  ], [
    r('.+'),
    render_page(page_not_found)
  ],
])

on_click('.tag-pill', tag => render_home(['tag', tag.innerText]))

on_click('.page-link', link => render_home(['offset', link.dataset.offset]))

on_click('#register-button', () => fetch_and_do(
  register_user($form_to_json('form')),
  case_of(
    resp_is_success(authenticate_user),
    resp_is_error(render_page_with_context(page_register, { user: $form_to_json('form') })))))

on_click('#login-button', () => fetch_and_do(
  login_user($form_to_json('form')),
  case_of(
    resp_is_success(authenticate_user),
    resp_is_error(render_page_with_context(page_login, { user: $form_to_json('form') })))))

on_click('#edit-user-button', () => fetch_and_do(
    edit_user($form_to_json('form')),
    case_of(
      resp_is_success(update_user),
      resp_is_error(render_page_with_context(page_settings, { user: $form_to_json('form') })))))

on_click('#publish-article', () => fetch_and_do(
  create_article($form_to_json('form')),
  case_of(
    resp_is_success(redirect_to_article),
    resp_is_error(render_page_with_context(page_editor, { article: $form_to_json('form') })))))

on_click('#edit-article', button => fetch_and_do(
    edit_article(button.dataset.slug, $form_to_json('form')),
    case_of(
      resp_is_success(redirect_to_article),
      resp_is_error(render_page_with_context(page_editor, { article: $form_to_json('form') })))))

on_click('#logout-button', logout)

on_click('.favorite-button', button => fetch_and_do(
  favorite_article(button.dataset.slug),
  case_of(
    resp_is_success(refresh_page),
    resp_is_error(redirect_to_login))))

on_click('.unfavorite-button', button => fetch_and_do(
  unfavorite_article(button.dataset.slug),
  case_of(
    resp_is_success(refresh_page),
    resp_is_error(redirect_to_login))))

on_click('#edit-button', button => redirect_to_editor(button.dataset.slug))

on_click('#delete-button', button => fetch_and_do(
  delete_article(button.dataset.slug),
  redirect_to_home))

on_click('#add-comment', button => fetch_and_do(
  add_comment(button.dataset.slug, $form_to_json('form')),
  refresh_page))

on_click('#follow-user', button => fetch_and_do(
  follow_user(button.dataset.username),
  refresh_page))

on_click('#unfollow-user', button => fetch_and_do(
  unfollow_user(button.dataset.username),
  refresh_page))

on_hash_changed(dispatch_hash)