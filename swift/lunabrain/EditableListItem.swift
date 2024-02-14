import SwiftUI

struct ListItem: Identifiable {
    var id = UUID()
    var text: String
    var indentationLevel: Int
}

struct EditableListView: View {
    @State private var items: [ListItem] = []
    @State private var newItemText: String = ""


    var body: some View {
        VStack {
            List {
                ForEach(items) { item in
                    HStack {
                        Button(action: {
                            if let index = items.firstIndex(where: { $0.id == item.id }) {
                                items[index].indentationLevel = max(item.indentationLevel - 1, 0)
                            }
                        }) {
                            Image(systemName: "arrow.left.circle.fill")
                        }
                        .buttonStyle(PlainButtonStyle())

                        Button(action: {
                            if let index = items.firstIndex(where: { $0.id == item.id }) {
                                items[index].indentationLevel += 1
                            }
                        }) {
                            Image(systemName: "arrow.right.circle.fill")
                        }
                        .buttonStyle(PlainButtonStyle())

                        TextField("List item", text: Binding(
                            get: { item.text },
                            set: {
                                if let index = items.firstIndex(where: { $0.id == item.id }) {
                                    items[index].text = $0
                                }
                            }
                        ))
                        .padding(.leading, CGFloat(item.indentationLevel * 20))
                    }
                }
                .onDelete(perform: removeItems)
            }
            
            HStack {
                TextField("New list item", text: $newItemText)
                Button("Add") {
                    var idtLvl = 0
                    if let lastItem = items.last {
                        idtLvl = lastItem.indentationLevel
                    }
                    items.append(ListItem(text: newItemText, indentationLevel: idtLvl))
                    newItemText = ""
                }
            }
            .padding()
        }
    }

    func removeItems(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
    }
}
