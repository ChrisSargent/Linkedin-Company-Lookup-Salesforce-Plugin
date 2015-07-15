# Linkedin-Company-Lookup-Salesforce-Plugin

No longer working due to stricter API restrictions from LinkedIn.

## sf_linkedin_lookup.js
This was a plugin for Salesforce (a Home page component) that was only loaded whn users visited the Account Edit page.

On which, their was a field for the Account's LinkedIn Company ID (The user was required to look this up and enter it)

When the ID had been entered, the script queried the LinkedIn Company API and retrieved information about the company with that given ID. It then populate the corresponding fields on the Account Edit page in Salesforce.

## ak_company_lookup_linkedin.html & ak_company_in.js
This was a little web app, based on the above that took the contents of a CSV file and could retrieve the same information from LinkedIn, either using Company IDs, Company Names or Company Domains.