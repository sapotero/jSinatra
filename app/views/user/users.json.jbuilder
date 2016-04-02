json.users @users do |user|
  json.name     user[:name]
  json.login    user[:login]
  json.password user[:password]
end