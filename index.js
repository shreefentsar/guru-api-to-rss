const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');
const router = express.Router();
const jsonfeedToRSS = require('jsonfeed-to-rss')
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router.get('/',async (req,res) => {
    const token_url = "https://www.guru.com/api/v1/oauth/token/access";
	const jobs_url = "https://www.guru.com/api/v1/search/job?pagesize=20"
    const client_id = "XXXXXXXXXXX";
    const client_secret = "XXXX-XXXXX-XXXXXXX-XXXXXX";
	const params = new URLSearchParams()
	params.append('client_id', client_id)
	params.append('client_secret', client_secret)
	params.append('grant_type', 'client_credentials')
	try{
    	const  token_request = await axios.put(token_url, params ,
            { headers:
                    {
                        "Content-Type" :  'application/x-www-form-urlencoded',
						"User-Agent": "PostmanRuntime/7.28.4",
						"Accept": "*/*"
                    }
            }
        );
		try{
    	const  jobs_request = await axios.get(jobs_url,
            { headers:
                    {
                        "Content-Type" :  'application/x-www-form-urlencoded',
						"User-Agent": "PostmanRuntime/7.28.4",
						"Accept": "*/*",
						"Authorization": "Bearer "+ token_request.data.access_token
                    }
            }
        );
			const items = [];
			jobs_request.data.Results.forEach( function (item){
			const date = new Date(item.DatePosted * 1).toISOString();
			items.push({
					"title" : item.JobTitle,
					"url" : "https://www.guru.com/work/detail/" + item.JobId,
					"content_html" : "<p>"+item.JobDescription+"<p>" +
									 "<p>BudgetDetails: "+item.BudgetDetails+"<p>" +
								  	 "<p>EmployerName: "+item.EmployerName+"<p>" +
									 "<p>EmployerFeedbackscore: "+item.EmployerFeedbackscore+"<p>" +
									 "<p>EmployerSpend: "+item.EmployerSpend+"<p>" +
									 "<p>EmployerCountryName: "+item.EmployerCountryName+"<p>" +
									 "<p>EmployerHasVerifiedPayMethod: "+item.EmployerHasVerifiedPayMethod+"<p>" +
									 "<p>JobLocations: "+item.JobLocations+"<p>",
					"date_published": date
				});
			});
		const jsonfeed={
		"version":"https://jsonfeed.org/version/1",
		"title":"guru.com feed",
 		"home_page_url":"https://www.guru.com",
  		"feed_url":"https://YOUR-PUBLIC-LINK-FOR-RSS.COM",
		"description":"guru.com feed",
		"items":items
  
		}
		const rssFeed = await jsonfeedToRSS(jsonfeed);
		res.type('application/xml');
        res.send(rssFeed);
    } catch(e) {
        console.log(e);
    }
        
    } catch(e) {
        console.log(e);
    }
	
});
app.use("/", router);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
