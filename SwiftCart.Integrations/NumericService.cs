namespace SwiftCart.Integrations {
    public class NumericService {
        private readonly HttpClient _httpClient;

        public NumericService(HttpClient httpClient) {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://www.dataaccess.com/webservicesserver/");
        }

        public async Task<string> NumberToWords(decimal number) {
            var soapRequest = $@"
                <soap:Envelope xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                    <soap:Body>
                        <NumberToDollars xmlns=""http://www.dataaccess.com/webservicesserver/"">
                            <dNum>{number}</dNum>
                        </NumberToDollars>
                    </soap:Body>
                </soap:Envelope>";

            var content = new StringContent(soapRequest, System.Text.Encoding.UTF8, "text/xml");
            var response = await _httpClient.PostAsync("NumberConversion.wso", content);
            response.EnsureSuccessStatusCode();
            var xml = await response.Content.ReadAsStringAsync();

            // Simplified parsing (real-world would use XML parser)
            var start = xml.IndexOf("<NumberToDollarsResult>") + 23;
            var end = xml.IndexOf("</NumberToDollarsResult>");
            return xml[start..end];
        }
    }
}
