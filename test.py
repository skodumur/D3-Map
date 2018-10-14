res={}
with open("Sheet1.csv", "r") as fline:
    for line in fline:
        arr = line.split("\t")
        temp = {"percent": arr[1]}
