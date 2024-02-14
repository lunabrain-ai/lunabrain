//
//  justshareApp.swift
//  justshare
//
//  Created by hacked on 9/10/23.
//

import SwiftUI

@main
struct justshareApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: TranscriptionViewModel())
        }
    }
}
