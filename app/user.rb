require "sinatra/reloader" if development?

get "/users" do
  users = [
    {
      name:     'admin',
      login:    'admin',
      password: 'admin'
    },
    {
      name:     'user',
      login:    'user',
      password: 'user'
    }
  ]

  render 'user/users', { users: users }
end

