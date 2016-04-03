require "sinatra/reloader" if development?

get "/api/users" do
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

  json 'user/users', { users: users }
end

