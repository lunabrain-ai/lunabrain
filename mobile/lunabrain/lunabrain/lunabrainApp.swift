//
//  lunabrainApp.swift
//  lunabrain
//
//  Created by hacked on 9/10/23.
//

import SwiftUI

@main
struct lunabrainApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: TranscriptionViewModel(), aiModel: AIViewModel())
        }
    }
}
