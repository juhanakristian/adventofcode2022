let filename = fsi.CommandLineArgs.[1]

let data = System.IO.File.ReadAllText(filename)

let points =
    Map
        .empty
        .Add("A", 1)
        .Add("B", 2)
        .Add("C", 3)
        .Add("X", 1)
        .Add("Y", 2)
        .Add("Z", 3)


let player =
    Map
        .empty
        .Add("A X", "C")
        .Add("A Y", "A")
        .Add("A Z", "B")
        .Add("B X", "A")
        .Add("B Y", "B")
        .Add("B Z", "C")
        .Add("C X", "B")
        .Add("C Y", "C")
        .Add("C Z", "A")

let roundScore (round: string) =
    let values = round.Split " "
    let playerPoints = points[player[round]]

    let resultPoints =
        match values[1] with
        | "X" -> 0
        | "Y" -> 3
        | _ -> 6

    playerPoints + resultPoints

let rounds = data.Split "\n"
let result = rounds |> Array.map roundScore |> Array.sum
printf "RESULT %i" result
