#load csv file
#for each row
#  for each col
#    clean the rotation
#    match the resident name
#    for each rotation
#      add rotation, block, resident to db
 
loadDB <- function (f) {
  dat <- read.csv2(f);
  
}


residents <- function() {
  # httr::get("https://highflowpeds.com/hffeeeback/api/residents)
  res <- jsonlite::fromJSON('["Farah Abu Dhais, MD","Keon Aghigh, MBBCh","Heather Becker, DO","Charlyne Cuyar Cruz, MD","Caylee Forschner, DO","Olivia Gyssler, MD","Quinn Icke, MD","Jason Lin, MD","Katelyn Liu, MD","Kevin Liu, MD","Kathryn Markham, DO","Erin Miller, MD","Riya Nag, DO","Andrea Carolina Quintero, MD","Doris Rapp, DO","Amy Saunders, DO","Christine Schafer, MD","Shivani Srikanth, DO","Abdullah Abu-Aqoulah, MD","Samuel Adams, MD","Tariq Almanaseer, MBBS","Anthony Bernicchi, MD","Meghan Berry, DO","Annalise Bowen, MD","Megan Brackmann, MD","Andrew Droste, MD","Alexis George, MD","Mary Grinstead, MD","Anna Lively, MD","Jordan Marquez, DO","Mai Phuong Nguyen Dang, DO","Mikayla Patel, MD","Liliet Pertierra, DO","Katherine Peterson, MD","Emily Rupe, MD","Ashlyn Sovereen, MD","John Stathakios, MD","Felicia White, MD","Spencer Adams, MD","Jenna Braun, MD","Caroline Buckley, MD","Maria Correa Roldan, MD","Kristen Erwin, DO","Swetha Gogu, DO","Tamara Gonzalez Copo, MD","Lyn Mattathil, MD","Julia O‘Donoghue, MD","Sejad Skokic, MD","Kaitlin Zorich, DO","Michael Kennett, MD","Geralyn Moody, MD","Ann Renner, MD","Amanda Stevens, DO"]')
  return(res)
}



     
      
