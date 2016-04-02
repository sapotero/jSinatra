require 'spec_helper'

describe Example do
  describe :truth do
    it "should be true" do
      Example.new.truth.should be_true
    end
  end
end
