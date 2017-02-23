# Instruction

Please think of a question whose answer will require some kind of web interaction. For example, one needs to do some searching and click a few buttons to find the best dining place on yelp.com. The answer should be visible on the webpage, i.e. it does not require complex reading comprehension or inference. 

Please provide the website and write the question as a template with meaningful blanks. It can be any appropriate website or website subdomain as long as the question template is flexible enough. Be creative! 

# Walk-through

First, enter the URL of the website, e.g. [http://yelp.com](http://yelp.com). 

Please make sure your website is **mobile-friendly**. You can test [mobile-friendliness here](https://search.google.com/search-console/mobile-friendly). 
Your submission will be **invalid** if the site doesn't pass the test.

Second, select a category for your website from the dropdown list.

Third, write down the question template with blanks. Please use parentheses "( )" to denote a blank. The words you write inside the parentheses should describe the meaning of the blank. Your question template should have at least **two** blanks. The more blanks the better! 

For instance, enter your question template as 

```
What is the best dining place that serves (type of food) near (geographic location)?
```

A table will be dynamically generated with column titles "type of food" and "geographic location" as you type out the template. 

Please fill out the table to complete the questions. Please also write down the answers you find on the website in the "ANSWER" column of the table. A live preview will be displayed below the table as you type. 

For example, fill out the table as

| **type of food**  	| **geographic location**           |  **ANSWER** |
|---------------	|--------------------------------------	| ----------------|
| Chinese food  	| Palo Alto                        	| Panda Express   |
| hamburger     	| Notre Dame De Paris                             | McDonald's      |
| fresh fruit     	| 112 Mercer St, Princeton, NJ          | Fruity Yogurt   | 
| ramen             | downtown Manhattan                    | Ippudo East Village |
| coffee        	| Disney World, Orlando, Fl             | Starbucks |
| ...      	| ...                              	| ... |

Please carefully verify the completed questions before you click **submit**. Upon submission, you will receive a confirmation code, which you should copy and paste back to the Mechanical Turk page.

# Examples

## Good example 1

Website: http://www.bankrate.com/calculators/mortgages/loan-calculator.aspx

Question template:
```
What is the monthly payment for (loan amount) in (loan term in years) with interest rate (rate)?
```

Fill out the table:

| loan amount 	| loan term in years 	| rate 	|
|-----------------	|------------------	|---------------------	|
| $5000               	| 3                	| 1.5%   	|
| $20000               	| 10                	| 3.44%       	|
| $39025              	| 2                	| 3.27%       	|
| ...              	| ...                	| ...       	|
| ...              	| ...                	| ...       	|

## Good example 2

Website: [https://www.wyndhamhotels.com/wyndham](https://www.wyndhamhotels.com/wyndham)

Question template:
```
What is the name of a wyndham hotel if I want to book 
(number of rooms) rooms for (number of guests) guests at 
(geographic location) from (start date) to (end date)?
```

Fill out the table: 

| number of rooms 	| number of guests 	| geographic location 	| start date 	| end date 	|
|-----------------	|------------------	|---------------------	|------------	|----------	|
| 2               	| 4                	| Las Vegas, NV, US   	| 02/20/17   	| 02/25/17 	|
| 3               	| 3                	| Yosemite Park       	| 03/11/17   	| 03/14/17 	|
| ...              	| ...                	| ...       	| ...   	| ... 	|
| ...              	| ...                	| ...       	| ...   	| ... 	|


## Bad example
Website: wikipedia.org

Question template:
```
Who is the (N-th) president of (country)?
```

This is a bad template because the answer requires too much reading comprehension. In general, a page with very dense informative text, such as wikipedia.org, is not a good website for question templates. 
