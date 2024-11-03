#load csv file
#for each row
#  for each col
#    clean the rotation
#    match the resident name
#    for each rotation
#      add rotation, block, resident to db
 

# Usage:
# s <- "../data/schedule.csv"
# n <- "../data/resident_key.txt"
# mat <- loadFromCSV(s,n)
# processMatrix(mat)


source("./clean.R")
source("./supabase.R")

# s is master schedule in csv format
# n is resident name key is tab delim format
loadFromCSV <- function (s, n) {
  sched <- read.csv2(s, sep=",");
  names <- read.csv2(n, sep="\t");
  ix <- match(sched[,1], names[,1])
  sched[,1] <- names[ix,2]
  if(sum(is.na(ix)) > 0) {
    ix.rm <- which(is.na(ix))
    sched <- sched[-ix.rm,]
  }
  
  # highly fragile hack to move PGY column to position 2
  sched <- sched[,c(1, ncol(sched), 2:(ncol(sched)-1))]
  sched
}


insertCell <- function(name, pgy, block, cell) {
  rots <- cleanRotations(cell)
  for(c in rots) {
    print(paste("Insert", name, pgy, c))
  }
}

# assumes first column in resident and second is PGY, followed by the rotations
processMatrix <- function(m) {
  apply(m, 1, function(x) {
    name <- x[1]
    pgy <- x[2]
    blocks <- names(x);
    rotations <- x[-c(1,2)];
    for(i in 1:length(rotations)) {
      block = colnameToBlock(blocks[i+2])
      x <- cleanRotations(rotations[i])
      for(rot in x[[1]]) {
          row = list(
            organization = "HDVCH Peds Residency",
            resident = name,
            pgy = pgy,
            block = block,
            role = rot
          )
          insertToPG("MasterSchedule", row)
      }
    }
  })
}

colnameToBlock <- function(x) {
  els <- unlist(strsplit(x, "\\."))
  year1 = as.integer(format(Sys.Date(), "%Y"))
  year2 = as.integer(format(Sys.Date(), "%Y"))
  if(as.numeric(els[3]) < 7) {
    year1 = year1 + 1
  }
  if(as.numeric(els[5]) < 7) {
    year2 = year2 + 1
  }
  blockname = paste0(els[1], " ", els[2], " (", els[3], "/", els[4], "/", year1, " - ", els[5], "/", els[6], "/", year2, ")")
  blockname
}

residents <- function() {
  # httr::get("https://highflowpeds.com/hffeeeback/api/residents)
  res <- jsonlite::fromJSON('["Farah Abu Dhais, MD","Keon Aghigh, MBBCh","Heather Becker, DO","Charlyne Cuyar Cruz, MD","Caylee Forschner, DO","Olivia Gyssler, MD","Quinn Icke, MD","Jason Lin, MD","Katelyn Liu, MD","Kevin Liu, MD","Kathryn Markham, DO","Erin Miller, MD","Riya Nag, DO","Andrea Carolina Quintero, MD","Doris Rapp, DO","Amy Saunders, DO","Christine Schafer, MD","Shivani Srikanth, DO","Abdullah Abu-Aqoulah, MD","Samuel Adams, MD","Tariq Almanaseer, MBBS","Anthony Bernicchi, MD","Meghan Berry, DO","Annalise Bowen, MD","Megan Brackmann, MD","Andrew Droste, MD","Alexis George, MD","Mary Grinstead, MD","Anna Lively, MD","Jordan Marquez, DO","Mai Phuong Nguyen Dang, DO","Mikayla Patel, MD","Liliet Pertierra, DO","Katherine Peterson, MD","Emily Rupe, MD","Ashlyn Sovereen, MD","John Stathakios, MD","Felicia White, MD","Spencer Adams, MD","Jenna Braun, MD","Caroline Buckley, MD","Maria Correa Roldan, MD","Kristen Erwin, DO","Swetha Gogu, DO","Tamara Gonzalez Copo, MD","Lyn Mattathil, MD","Julia O‘Donoghue, MD","Sejad Skokic, MD","Kaitlin Zorich, DO","Michael Kennett, MD","Geralyn Moody, MD","Ann Renner, MD","Amanda Stevens, DO"]')
  return(res)
}



     
      
