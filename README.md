# Website Scraper

A Node.js application that uses Puppeteer to scrape entire websites and save their content as JSON files.

## Features

- Scrapes entire website content including:
  - Page title and description
  - Headings (h1-h6)
  - Links
  - Images
  - Paragraphs
  - Lists (ordered and unordered)
  - Tables
- Saves content in a structured JSON format
- Creates an output directory for scraped content
- Handles dynamic content loading

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage

Run the scraper with a URL as an argument:

```bash
node scraper.js https://example.com
```

The scraped content will be saved in the `output` directory as a JSON file. The filename will be generated from the URL.

## Output Format

The JSON output includes:
- `title`: Page title
- `description`: Meta description
- `headings`: Array of headings with their levels and text
- `links`: Array of links with their text and URLs
- `images`: Array of images with their sources and alt text
- `paragraphs`: Array of paragraph texts
- `lists`: Array of lists with their types and items
- `tables`: Array of tables with their headers and rows

## Notes

- The scraper waits for the page to be fully loaded before capturing content
- Some websites may block automated scraping
- JavaScript-rendered content is captured
- The scraper uses a headless browser for better performance 