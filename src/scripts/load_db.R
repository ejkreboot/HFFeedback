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
  sched <- read.csv2(s, sep=",", quote="\"");
  names <- read.csv2(n, sep="\t", quote="\"");
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

}



     
      
