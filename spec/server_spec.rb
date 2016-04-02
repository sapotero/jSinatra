require 'spec_helper'

describe "Server" do
  before do
    get '/'
  end
  subject {last_response}

  it {should be_ok}

end
