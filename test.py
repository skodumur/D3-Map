res={}
i =0;
with open("Sheet1.csv", "r") as fline:
    with open("Sheet3.csv", "r") as fd:
        subs = fd.readlines()
        for line in fline:
            t = []
            for j in range(i, i+5):
                split = subs[j].split(",")
                t.append(int(split[2].rstrip()))
            i += 5
            arr = line.split("\t")
            temp = {"percent": float(arr[2]), "result": int(arr[1]), "total": int(arr[3].rstrip()), "detail": t}
            #temp = {"percent": int(arr[2]),"result": int((arr[1]), "total": int(arr[3].rstrip()), "detail": t}
            res[arr[0]] = temp
    print(res)
