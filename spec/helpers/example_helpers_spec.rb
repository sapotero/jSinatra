require 'spec_helper'

describe ExampleHelpers do
  class Dummy
    include ExampleHelpers
  end

  describe :helper_method do
    it "should be return some_helper" do
      Dummy.new.helper_method.should eq "some_helper"
    end
  end
end
