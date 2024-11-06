library(httr)
library(jsonlite)
library(dotenv)

load_dot_env()

# row should be named list with names matching column names
insertToPG <- function(table, row) {
  supabase_url <- Sys.getenv("SUPABASE_URL")
  api_key <- Sys.getenv("SUPABASE_API_KEY")
  row_json <- toJSON(row, auto_unbox = TRUE)
  response <- POST(
    url = paste0(supabase_url, "/rest/v1/", table),
    add_headers(
      "apikey" = api_key,
      "Authorization" = paste("Bearer", api_key),
      "Content-Type" = "application/json"
    ),
    body = row_json
  )
  if (status_code(response) == 201) {
    print("Row inserted successfully")
  } else {
    print("Failed to insert row")
    print(content(response, as = "text"))
  }
}
