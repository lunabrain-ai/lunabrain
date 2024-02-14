//
//  ContentView.swift
//  justshare desktop
//
//  Created by hacked on 10/3/23.
//

import SwiftUI

struct ContentView: View {
    @State private var text = "This is a **test**."

    var body: some View {
        VStack {
            Text("hello")
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
