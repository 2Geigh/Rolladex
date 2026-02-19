require 'net/http'
require 'uri'

i = 0
while true do
  url = URI.parse('http://localhost:3001/api_sanity_check')
  response = Net::HTTP.get_response(url)
  puts i
  puts response.body
  i = i + 1
end