with open("cypress/fixtures/huge_file.csv", "w") as file:
    file.write("Item, Value")
    for i in range(1000000):
        file.write(f"\nItem {i}, {i}")