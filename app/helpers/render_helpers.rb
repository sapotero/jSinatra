module RenderHelpers
  # require 'tilt/jbuilder.rb'

  def json( template, data )
    tmp = Tilt::JbuilderTemplate.new("app/views/#{template}.json.jbuilder")
    
    scope = Object.new

    data.keys.each do |key|
      scope.instance_variable_set :"@#{key}", data[key]
    end

    logger.debug( "foo" )
    
    tmp.render( scope )
  end
end
