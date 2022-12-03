let filename = fsi.CommandLineArgs.[1]

let data = System.IO.File.ReadAllText(filename)

let lines = data.Split "\n\n"

let elfTotals =
    lines
    |> Array.map (fun line ->
        let elfLines = line.Split "\n"
        let values = elfLines |> Array.map (fun value -> value |> int)
        Array.toList values |> List.sum)

let sorted = Array.toList elfTotals |> List.sortDescending
let sum = sorted.[0] + sorted.[1] + sorted.[2]
printfn "RESULT %i" sum
